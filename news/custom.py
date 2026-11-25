"""Load a story written by hand (stories/<channel>-<YYYY-MM-DD>-<short>.json) with the pictures chosen for it.

python -m news.custom stories/<name>.json [<find folder>]   checks a story (and its picks against the find index)

Every story names its channel ("channel": "k8", news/channels.py): its file name starts with it, it inherits the
channel's defaults (style, kicker, pace, fx) for the keys it leaves out, and it is voiced with the channel's voice.
Only a trial ("trial": true) may set "voice": {"speaker": …, "style": …} to try another VOICEVOX voice before the
owner chooses it for the channel (owner, 25/11/2026: "thử thay voice thành voice nữ"); a real video never does.
"""
from dataclasses import dataclass
from datetime import date
from difflib import get_close_matches
import json
import os
from pathlib import Path
import re
import sys

from PIL import Image, ImageOps

from . import channels
from .captions import caption_path, check as check_caption
from .edits import cut_problems, move_problems
from .sources import Release
from .story import Beat
from .visuals import Photo

STORY_KEYS = {"stage", "title", "date", "source", "source_url", "searches", "scenes", "issue", "style", "kicker",
              "music", "pace", "fx", "channel", "trial", "review", "voice"}
REVIEW = re.compile(r"^([0-9]+)/([0-9]+)$")   # "review": "<pictures that passed>/<pictures>" (tools/review_picks.py)
HOOK_LIMIT = 55   # the hook line is said in about 5 seconds: 45-50 characters at speed 1.2; warned above this
# Pictures a scene (owner, 19/11/2026: "nếu nội dung quá 6s thì phải tìm 2 ảnh, dưới 6s thì 1 ảnh cũng đc, tự do"):
# a scene whose words last over TWO_FROM seconds has at least two pictures. Before the voice is made the length
# is estimated: about SPOKEN written characters a second at speed 1.2, pauses included (CLAUDE.md, "Length").
TWO_FROM, SPOKEN = 6.0, 6.4
STYLES = ("news", "paper", "story")
SCENE_KEYS = {"label", "headline", "lines", "value", "evidence", "photo", "cut", "why", "era"}
LINE_KEYS = {"text", "say", "quote"}
PHOTO_KEYS = {"pick", "focus", "fit", "move", "tone", "depth"}
FX_KEYS = {"motion", "depth", "text", "face"}
TONES = ("sepia", "mono", "color")
MUSIC_KEYS = {"pick", "volume", "start", "file", "title", "creator", "license", "page"}
ROOT = Path(__file__).resolve().parent.parent   # the repository: "music": {"file": "music/<name>.mp3"} is read from it
AUDIO = (".mp3", ".ogg", ".oga", ".opus", ".wav", ".flac", ".m4a")
PACE_KEYS = {"speed", "line_pause", "scene_pause"}
PACE_LIMITS = {"speed": (0.7, 1.3), "line_pause": (0.0, 2.0), "scene_pause": (0.0, 3.0)}


@dataclass(frozen=True)
class Music:
    """A quiet piece under the voice and its credit: a file of the find folder (search "music:…", "pick"), or a
    recording kept in the repository ("file": "music/<name>.mp3", e.g. the channel's own music in its defaults)."""
    path: str
    title: str
    page: str
    creator: str
    license: str
    volume: float = 1.0   # 1 = the usual level under the voice (about 17 dB below it); 0.5 quieter, 1.5 louder
    start: float = 0.0    # seconds of the recording skipped (a silence or a noise at its beginning)

    def credit(self):
        return {"title": self.title, "page": self.page, "creator": self.creator, "license": self.license}
PICK = re.compile(r"^([1-9][0-9]*)-([1-9][0-9]*)$")
NAME = re.compile(r"^[A-Za-z0-9._-]+$")
# prefixes of a search; without one: Commons words
SEARCH_KINDS = ("file", "music", "web", "url", "page", "jps", "wiki", "geo")
WISH = "=>"                                                     # "<search> => <what the picture must show>"
GEO = re.compile(r"^(-?\d+(?:\.\d+)?)\s*[,; ]\s*(-?\d+(?:\.\d+)?)(?:\s+(\d+)\s*m?)?$")
NOT_LATIN = re.compile(r"[^\x00-\u024f\u2000-\u206f]")          # Japanese, Chinese, Cyrillic …: the ranking reads English


class StoryError(ValueError):
    """A story file that cannot be used; the message lists every problem found."""


def unknown(keys, allowed, where):
    problems = []
    for key in sorted(set(keys) - allowed):
        guess = get_close_matches(key, allowed, n=1)
        hint = f" (did you mean {guess[0]!r}?)" if guess else f" (allowed: {', '.join(sorted(allowed))})"
        problems.append(f"{where}: unknown key {key!r}{hint}")
    return problems


def text_problem(value, where, *, required=True):
    if value is None and not required:
        return []
    if not isinstance(value, str) or (required and not value.strip()):
        return [f"{where} must be a non-empty string, got {value!r}"]
    return []


def search_parts(search):
    """(kind, words, wish) of a search: "wiki:美空ひばり => a singer on a stage" → ("wiki", "美空ひばり",
    "a singer on a stage"). The kind is the prefix ("commons" without one); the wish is what the picture must show,
    in English, and is empty when the search has none. url:, file: and music: are taken whole (no wish)."""
    kind, words, wish = "commons", search, ""
    for name in SEARCH_KINDS:
        if search.startswith(name + ":"):
            kind, words = name, search[len(name) + 1:]
            break
    if kind not in ("file", "music", "url"):
        words, _, wish = words.partition(WISH)
    return kind, words.strip(), wish.strip()


def search_problems(search, where):
    """The problems of the new search syntax (wiki:, geo:, the wish after "=>"); old searches have none."""
    kind, words, wish = search_parts(search)
    if kind in ("file", "music", "url"):
        if f" {WISH} " in search:
            return [f'{where}: a wish ("{WISH} …") works with Commons words, web:, page:, jps:, wiki: and geo:, not with {kind}:']
        return []
    problems = []
    if WISH in search:
        if not words:
            problems.append(f'{where}: nothing to search before "{WISH}", got {search!r}')
        if not wish:
            problems.append(f'{where}: after "{WISH}" write what the picture must show, in English, got {search!r}')
        elif NOT_LATIN.search(wish):
            problems.append(f'{where}: the wish after "{WISH}" must be in English (the ranking reads English only; '
                            f"the search words before it may be Japanese), got {wish!r}")
    if kind == "wiki" and not words:
        problems.append(f'{where}: "wiki:" needs a name or a Wikidata item, e.g. "wiki:美空ひばり" or "wiki:Q467982"')
    if kind == "jps" and not words:
        problems.append(f'{where}: "jps:" needs words to look for in Japan Search, e.g. "jps:黒船来航"')
    if kind == "page" and not re.fullmatch(r"https?://\S+", words):
        problems.append(f'{where}: "page:" needs the address of one article, e.g. "page:https://www.example.jp/'
                        f'articles/123", got {search!r}')
    if kind == "geo" and not GEO.match(words):
        problems.append(f'{where}: "geo:" must be "geo:<lat>,<lon> <metres>", e.g. "geo:35.6852,139.7528 400", '
                        f"got {search!r}")
    return problems


def picks_of(scene):
    """The pictures of a scene as a list of {"pick": …} (a scene may have one picture or a list of them)."""
    photo = scene.get("photo")
    if photo is None:
        return []
    return [{"pick": item} if isinstance(item, str) else item for item in (photo if isinstance(photo, list) else [photo])]


def check_photos(photo, where, searches):
    if isinstance(photo, list):
        if not 1 <= len(photo) <= 4:
            return [f'{where}: "photo" as a list must have 1 to 4 pictures, got {len(photo)}']
        return [problem for number, item in enumerate(photo, 1)
                for problem in check_photo(item, f"{where}, picture {number}", searches)]
    return check_photo(photo, where, searches)


def check_photo(photo, where, searches):
    problems = []
    if isinstance(photo, str):
        photo = {"pick": photo}
    if not isinstance(photo, dict):
        return [f'{where}: "photo" must be "<k>-<n>" or {{"pick": "<k>-<n>", ...}}, got {photo!r}']
    problems += unknown(photo, PHOTO_KEYS, where + ".photo")
    pick = photo.get("pick")
    match = PICK.match(pick) if isinstance(pick, str) else None
    if not match:
        problems.append(f'{where}: "pick" must look like "5-6" (search 5, picture 6), got {pick!r}')
    elif int(match[1]) > len(searches):
        problems.append(f"{where}: picture {pick} refers to search {match[1]}, but the story has only "
                        f"{len(searches)} searches")
    if "focus" in photo:
        focus = photo["focus"]
        if (not isinstance(focus, list) or len(focus) != 2
                or not all(isinstance(v, (int, float)) and not isinstance(v, bool) and 0 <= v <= 1 for v in focus)):
            problems.append(f'{where}: "focus" must be [x, y] with numbers from 0 to 1, got {focus!r}')
    if "fit" in photo and photo["fit"] not in ("cover", "contain"):
        problems.append(f'{where}: "fit" must be "cover" or "contain", got {photo["fit"]!r}')
    if "depth" in photo and not isinstance(photo["depth"], bool):
        problems.append(f'{where}: "depth" must be true or false (false: a flat picture such as a document), got {photo["depth"]!r}')
    if "tone" in photo and photo["tone"] not in TONES:
        problems.append(f'{where}: "tone" must be one of {", ".join(TONES)}, got {photo["tone"]!r}')
    problems += move_problems(photo, where)
    return problems


def music_file_problems(music):
    """A recording kept in the repository: "file" under music/, an audio file that exists, a "title" to credit, no
    "pick" (the owner's music for a channel, 25/11/2026: "dùng sáo trúc này")."""
    found, file = [], music.get("file")
    if "pick" in music:
        found.append('"music": give either "pick" (a "music:…" search) or "file" (a recording in music/), not both')
    if not (isinstance(file, str) and file.startswith("music/") and ".." not in file
            and file.lower().endswith(AUDIO)):
        found.append(f'"music": "file" must be a recording in the music/ folder ({", ".join(AUDIO)}), got {file!r}')
    elif not (ROOT / file).is_file():
        found.append(f'"music": the file {file} is not in the repository')
    found += text_problem(music.get("title"), '"music": "title"')
    for key in ("creator", "license", "page"):
        found += text_problem(music.get(key), f'"music": "{key}"', required=False)
    return found


def validate(data, name=None):
    """Return the list of problems of a story (empty when it is usable). The story is checked with its channel's
    defaults in the keys it leaves out (channels.inherit), as it will be made."""
    problems = []
    if name is not None and not NAME.match(name):
        problems.append(f"file name {name!r}: use only ASCII letters, digits, '.', '_' and '-' "
                        "(no spaces, no Japanese or Vietnamese characters), e.g. k8-2026-11-19-todai-sotsu.json")
    if not isinstance(data, dict):
        return problems + ["the story must be a JSON object"]
    channel = data.get("channel")
    if channel is None:
        problems.append(f'"channel" is missing: write the channel of the story, one of {", ".join(channels.ids())}')
    elif channels.get(channel) is None:
        problems.append(f'"channel" must be one of {", ".join(channels.ids())} (channels/), got {channel!r}')
    elif name is not None and NAME.match(name):
        problems += channels.name_problems(name, channel)
    data = channels.inherit(data)
    if "trial" in data and not isinstance(data["trial"], bool):
        problems.append(f'"trial" must be true or false (true: a trial or sample video, the length rules do not '
                        f'stop its render), got {data["trial"]!r}')
    if "voice" in data:
        trial_voice = data["voice"]
        if data.get("trial") is not True:
            problems.append('"voice" is only for a trial ("trial": true): a video of the channel is voiced with the '
                            "channel's voice (channels/<id>.json), changed there once the owner approves a trial")
        elif (not isinstance(trial_voice, dict) or set(trial_voice) != {"speaker", "style"}
              or not all(isinstance(value, str) and value.strip() for value in trial_voice.values())):
            problems.append(f'"voice" must be {{"speaker": "<VOICEVOX speaker>", "style": "<style>"}}, '
                            f'got {trial_voice!r}')
    if "review" in data and not (isinstance(data["review"], str) and REVIEW.match(data["review"])):
        problems.append(f'"review" must be "<pictures that passed>/<pictures>", e.g. "23/23" (the picture review, '
                        f'tools/review_picks.py), got {data["review"]!r}')
    problems += unknown(data, STORY_KEYS, "story")
    problems += text_problem(data.get("title"), '"title"')
    try:
        date.fromisoformat(data.get("date"))
    except (TypeError, ValueError):
        problems.append(f'"date" must be YYYY-MM-DD, got {data.get("date")!r}')
    if data.get("stage", "find") not in ("find", "render"):
        problems.append(f'"stage" must be "find" or "render", got {data.get("stage")!r}')
    issue = data.get("issue")
    if issue is not None and (not isinstance(issue, int) or isinstance(issue, bool) or issue < 1):
        problems.append(f'"issue" must be the issue number (a whole number), got {issue!r}')
    problems += text_problem(data.get("source"), '"source"', required=False)
    problems += text_problem(data.get("source_url"), '"source_url"', required=False)
    problems += text_problem(data.get("kicker"), '"kicker"', required=False)
    if data.get("style", "news") not in STYLES:
        problems.append(f'"style" must be one of {", ".join(STYLES)}, got {data.get("style")!r}')
    searches = data.get("searches", [])
    if not isinstance(searches, list) or not all(isinstance(s, str) and s.strip() for s in searches):
        problems.append(f'"searches" must be a list of non-empty strings, got {searches!r}')
        searches = []
    for number, search in enumerate(searches, 1):
        problems += search_problems(search, f"search {number}")
    music = data.get("music")
    if music is not None:
        if not isinstance(music, dict):
            problems.append(f'"music" must be {{"pick": "<k>-<n>", "volume": 1}}, got {music!r}')
        else:
            problems += unknown(music, MUSIC_KEYS, "music")
            match = PICK.match(music.get("pick", "")) if isinstance(music.get("pick"), str) else None
            if "file" in music:
                problems += music_file_problems(music)
            elif not match:
                problems.append(f'"music": "pick" must look like "25-1", got {music.get("pick")!r}')
            elif int(match[1]) > len(searches) or not searches[int(match[1]) - 1].startswith("music:"):
                problems.append(f'"music": pick {music["pick"]} must come from a "music:…" search')
            volume = music.get("volume", 1.0)
            if not isinstance(volume, (int, float)) or isinstance(volume, bool) or not 0.2 <= volume <= 3:
                problems.append(f'"music": "volume" must be a number from 0.2 to 3, got {volume!r}')
            start = music.get("start", 0.0)
            if not isinstance(start, (int, float)) or isinstance(start, bool) or not 0 <= start <= 120:
                problems.append(f'"music": "start" must be seconds from 0 to 120, got {start!r}')
    fx = data.get("fx")
    if fx is not None:
        if not isinstance(fx, dict):
            problems.append(f'"fx" must be {{"motion": true, "depth": true, "text": true, "face": true}}, got {fx!r}')
        else:
            problems += unknown(fx, FX_KEYS, "fx")
    pace = data.get("pace")
    if pace is not None:
        if not isinstance(pace, dict):
            problems.append(f'"pace" must be {{"speed": 0.9, "line_pause": 0.3, "scene_pause": 0.6}}, got {pace!r}')
        else:
            problems += unknown(pace, PACE_KEYS, "pace")
            for key, (low, high) in PACE_LIMITS.items():
                value = pace.get(key, low)
                if not isinstance(value, (int, float)) or isinstance(value, bool) or not low <= value <= high:
                    problems.append(f'"pace": "{key}" must be a number from {low} to {high}, got {value!r}')
    scenes = data.get("scenes")
    if not isinstance(scenes, list) or not scenes:
        return problems + ['"scenes" must be a non-empty list']
    for number, scene in enumerate(scenes, 1):
        where = f"scene {number}"
        if not isinstance(scene, dict):
            problems.append(f"{where} must be an object")
            continue
        problems += unknown(scene, SCENE_KEYS, where)
        problems += text_problem(scene.get("headline"), f'{where}: "headline"')
        for key in ("label", "value", "evidence", "era"):
            problems += text_problem(scene.get(key), f'{where}: "{key}"', required=False)
        lines = scene.get("lines")
        if not isinstance(lines, list) or not lines:
            problems.append(f'{where}: "lines" must be a non-empty list of sentences, got {lines!r}')
        else:
            for index, line in enumerate(lines, 1):
                at = f"{where}, line {index}"
                if isinstance(line, dict):
                    problems += unknown(line, LINE_KEYS, at)
                    problems += text_problem(line.get("text"), f'{at}: "text"')
                    problems += text_problem(line.get("say"), f'{at}: "say"', required=False)
                    if "quote" in line and not isinstance(line["quote"], bool):
                        problems.append(f'{at}: "quote" must be true or false, got {line["quote"]!r}')
                else:
                    problems += text_problem(line, at)
        if "photo" in scene:
            problems += check_photos(scene["photo"], where, searches)
        problems += cut_problems(scene, where)
    return problems


def read(path):
    """Read and check a story; raises StoryError listing every problem. Returns it with its channel's defaults in
    the keys it leaves out (channels.inherit)."""
    path = Path(path)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise StoryError(f"{path}: not valid JSON: {error}") from None
    problems = validate(data, path.stem)
    if problems:
        raise StoryError(f"{path} has {len(problems)} problem(s):\n  - " + "\n  - ".join(problems))
    return channels.inherit(data)


def found_pictures(data, pictures):
    """The pictures of the find index by pick ("k-n"), after checking the picks still match the searches."""
    index_path = Path(pictures) / "index.json" if pictures else None
    if not index_path or not index_path.exists():
        return None
    groups = {group["k"]: group for group in json.loads(index_path.read_text(encoding="utf-8"))}
    searches = data.get("searches", [])
    problems = []
    for number, scene in enumerate(data["scenes"], 1):
        for pick in (item["pick"] for item in picks_of(scene)):
            k, n = map(int, PICK.match(pick).groups())
            group = groups.get(k)
            if group is None:
                problems.append(f"scene {number}: picture {pick}: search {k} has not been run yet (stage find)")
            elif group["query"] != searches[k - 1]:
                problems.append(f"scene {number}: picture {pick} was found by search {k} = {group['query']!r}, but "
                                f"searches[{k}] in the story is now {searches[k - 1]!r}. Searches must only be "
                                "appended; put the old search back or pick again after a new find")
            elif group.get("error") and not group["results"]:
                problems.append(f"scene {number}: picture {pick}: search {k} failed ({group['error']})")
            elif group.get("unusable"):
                problems.append(f"scene {number}: picture {pick}: search {k} cannot be used as written "
                                f"({group['unusable']}); append another search")
            elif n > len(group["results"]):
                problems.append(f"scene {number}: picture {pick} is not among the {len(group['results'])} "
                                f"pictures found by search {k}")
    if isinstance(data.get("music"), dict) and "pick" in data["music"]:
        k, n = map(int, PICK.match(data["music"]["pick"]).groups())
        group = groups.get(k)
        if group is None or not group["results"] or n > len(group["results"]):
            problems.append(f"music {data['music']['pick']}: not among the files found by search {k} (stage find)")
    if problems:
        raise StoryError(f"{len(problems)} pick problem(s):\n  - " + "\n  - ".join(problems))
    return {f"{k}-{number}": result for k, group in groups.items()
            for number, result in enumerate(group["results"], 1)}


def without_picture(data):
    return [(number, scene.get("label", ""), "value" in scene)
            for number, scene in enumerate(data["scenes"], 1) if "photo" not in scene]


def report_without_picture(data):
    missing = without_picture(data)
    if not missing:
        print("Every scene has a picture.")
        return
    print(f"{len(missing)} scene(s) without a picture (text card) — tell the owner which and why:")
    for number, label, has_value in missing:
        print(f"  scene {number} {label}" + ("" if has_value else "  (no value: not a pure-figure scene)"))


def line_text(line):
    return line if isinstance(line, str) else line.get("text", "") if isinstance(line, dict) else ""


def spoken_seconds(scene, speed=1.2):
    """About how long the words of a scene last: its written characters (no punctuation, no spaces) at the pace."""
    written = sum(len(re.sub(r"[\W_]", "", line_text(line))) for line in scene.get("lines") or [])
    return written / (SPOKEN * (speed or 1.2) / 1.2)


def edit_warnings(data, sample=False):
    """What a story of a channel with the Tin Nhật edit ("edit": "tin-nhat" in channels/<id>.json; owner, 18/11/2026:
    "cho 4 kênh này học cách edit của kênh tin nhật đi, học tốt vào") leaves out of that edit (CLAUDE.md, "The edit"
    and "The hook"). Warnings, not errors: a trial may leave something out on purpose, and the closing comment then
    says why. `data` is the story with its channel's defaults (read()). While the pictures are not chosen yet
    (stage find) only the script is checked; at stage render the pictures, edits, music and review too. A sample
    (stories/mau-*.json, `sample`) shows the format on the fixture's stand-in pictures: it carries no review."""
    channel = channels.get(data.get("channel"))
    if not channel or channel.get("edit") != "tin-nhat" or not data.get("scenes"):
        return []
    found, scenes = [], data["scenes"]
    if data.get("style") != "story":
        found.append(f'"style" is {data.get("style")!r}: the edit uses the "story" frame')
    if off := [key for key in sorted(FX_KEYS) if not (data.get("fx") or {}).get(key)]:
        found.append(f'picture effects off: {", ".join(off)} (the edit has "fx" with all four on)')
    if (data.get("pace") or {}) != channel["defaults"].get("pace"):
        found.append(f'"pace" is {data.get("pace")!r}, not the channel\'s {channel["defaults"].get("pace")!r} (read fast, '
                     "like the source video)")
    first = scenes[0].get("lines") or [""]
    if not (isinstance(first[0], dict) and first[0].get("quote")):
        found.append('the hook: line 1 of scene 1 must be printed big while it is spoken, {"text": …, "quote": true}')
    if (size := len("".join(line_text(first[0]).split()))) > HOOK_LIMIT:
        found.append(f"the hook: line 1 has {size} characters; it is said in about 5 seconds (45-50 characters, "
                     f"{HOOK_LIMIT} at most): the whole story and its meaning in one plain line")
    # the ending is free (owner, 19/11/2026: "tự do, miễn hay"): no form of ending is warned about any more
    own_music = isinstance(data.get("music"), dict) and "file" in data["music"]   # the channel's own recording
    if not own_music and not any(isinstance(search, str) and search.startswith("music:")
                                 for search in data.get("searches", [])):
        found.append('no "music:" search: every video has a quiet piece under the voice, e.g. '
                     '"music:Schumann Träumerei piano"')
    if data.get("stage", "find") != "render":
        return found
    if not data.get("music"):
        found.append('no "music" chosen: pick a recording of the "music:" search, {"pick": "<k>-<n>"}')
    if not picks_of(scenes[0]):
        found.append("the hook: scene 1 has no picture; the hook line is printed on the first picture, which the "
                     "Japanese audience must recognise at once")
    for number, scene in enumerate(scenes, 1):
        picks = picks_of(scene)
        if not picks and not scene.get("value"):
            found.append(f"scene {number}: no picture (a text card only for a pure figure, with a \"value\")")
        elif len(picks) == 1 and (seconds := spoken_seconds(scene, (data.get("pace") or {}).get("speed"))) > TWO_FROM:
            found.append(f"scene {number}: 1 picture for about {seconds:.0f} s of words; a scene over "
                         f"{TWO_FROM:.0f} seconds has 2 (under that, 1 is enough)")
        if without := [str(index) for index, pick in enumerate(picks, 1) if not pick.get("move")]:
            found.append(f"scene {number}: picture {', '.join(without)} without a \"move\" (the effects act on named moves)")
        if number > 1 and not scene.get("cut"):
            found.append(f'scene {number}: no "cut" (how the scene arrives)')
        if not scene.get("why"):
            found.append(f'scene {number}: no "why" (the reason of its edits, for the owner)')
    if not sample:
        count = sum(len(picks_of(scene)) for scene in scenes)
        review = REVIEW.match(data.get("review") or "")
        if not review:
            found.append(f'no "review": run tools/review_picks.py, check every row (the hook picture first), re-pick '
                         f'until all pass, then write "review": "{count}/{count}"')
        elif review[1] != review[2] or int(review[2]) != count:
            found.append(f'"review" is {data["review"]!r}, but every one of the {count} pictures must pass the review '
                         f'("{count}/{count}"): re-pick and review again')
    return found


def report_edit(data, path):
    """Print the edit warnings of a story (GitHub annotations in a workflow)."""
    found = edit_warnings(data, Path(path).stem.startswith("mau-"))
    prefix = "::warning::" if os.environ.get("GITHUB_ACTIONS") else "warning: "
    for warning in found:
        print(f"{prefix}{Path(path).name}, the edit: {warning}")
    return found


def toned(image, tone):
    """Old-photograph tones: "sepia" (warm brown, as old prints), "mono" (black and white), "color" (as it is)."""
    if tone == "color":
        return image
    grey = ImageOps.autocontrast(image.convert("L"), cutoff=1)
    if tone == "mono":
        return grey.convert("RGB")
    return ImageOps.colorize(grey, black="#1d130a", mid="#8c6c47", white="#f6e8cb")


def voice_of(data, channel):
    """(speaker, style): the channel's voice, or the one a trial story tries (\"voice\" with \"trial\": true)."""
    voice = data.get("voice") if data.get("trial") is True and isinstance(data.get("voice"), dict) else None
    voice = voice or channel["voice"]
    return voice["speaker"], voice["style"]


def load_story(path, pictures=None):
    data = read(path)
    found = found_pictures(data, pictures)
    music = None
    if isinstance(data.get("music"), dict) and "file" in data["music"]:
        own = data["music"]
        music = Music(str(ROOT / own["file"]), own["title"], own.get("page", ""), own.get("creator", ""),
                      own.get("license", ""), float(own.get("volume", 1.0)), float(own.get("start", 0.0)))
    elif data.get("music"):
        if found is None:
            raise StoryError("the story has music, but no find folder with index.json was given (--pictures)")
        entry = found[data["music"]["pick"]]
        music = Music(str(Path(pictures) / entry["file"]), entry["title"].removeprefix("File:"), entry["page"],
                      entry.get("artist") or "Wikimedia Commons", entry.get("license", ""),
                      float(data["music"].get("volume", 1.0)), float(data["music"].get("start", 0.0)))
    pace = data.get("pace") or {}
    channel = channels.get(data["channel"])
    release = Release(data.get("source_url", ""), data["title"], date.fromisoformat(data["date"]),
                      data.get("source", ""), (), data.get("style", "news"), data.get("kicker", ""), music,
                      float(pace.get("speed", 0.96)), float(pace.get("line_pause", 0.0)),
                      float(pace.get("scene_pause", 0.0)), data.get("fx"),
                      voice_of(data, channel), channel["id"], bool(data.get("trial")))
    report_without_picture(data)
    beats, photos = [], {}
    for index, scene in enumerate(data["scenes"]):
        lines = [line if isinstance(line, str) else line["text"] for line in scene["lines"]]
        say = [line if isinstance(line, str) else line.get("say", line["text"]) for line in scene["lines"]]
        picks = picks_of(scene)
        visual = "photo" if picks else "data" if scene.get("value") else "document"
        beats.append(Beat(scene.get("label", "ニュース"), scene["headline"], tuple(lines), visual,
                          scene.get("value", ""), scene.get("evidence", ""), tuple(say) if say != lines else (),
                          scene.get("cut", ""), scene.get("why", ""), scene.get("era", ""),
                          tuple(number for number, line in enumerate(scene["lines"])
                                if isinstance(line, dict) and line.get("quote"))))
        if picks:
            if found is None:
                raise StoryError(f"Scene {index + 1} picks picture {picks[0]['pick']}, but no find folder with "
                                 "index.json was given (--pictures)")
            photos[index] = []
            for pick in picks:
                entry = found[pick["pick"]]
                with Image.open(Path(pictures) / entry["file"]) as original:
                    image = toned(ImageOps.exif_transpose(original).convert("RGB"), pick.get("tone", "color"))
                photos[index].append(Photo(image, entry["page"], entry["title"].removeprefix("File:"),
                                           entry.get("artist") or "Wikimedia Commons", entry.get("license", ""),
                                           entry.get("license_url", ""), tuple(pick.get("focus", (0.5, 0.5))),
                                           pick.get("fit", "cover"), pick.get("move", ""), pick.get("depth", True)))
    return release, beats, photos


def main():
    if len(sys.argv) not in (2, 3):
        sys.exit("usage: python -m news.custom stories/<name>.json [<find folder>]")
    try:
        data = read(sys.argv[1])
        if len(sys.argv) == 3:
            if found_pictures(data, sys.argv[2]) is None:
                print(f"note: no index.json in {sys.argv[2]}; picks not checked against the find results")
    except StoryError as error:
        sys.exit(f"error: {error}")
    report_without_picture(data)
    warned = report_edit(data, sys.argv[1])
    caption = caption_path(sys.argv[1])
    if caption.exists():
        if problems := check_caption(caption):
            sys.exit("error: " + "\n  - ".join([f"{len(problems)} caption problem(s):"] + problems))
        print(f"{caption}: OK")
    else:
        print(f"note: no posting caption yet ({caption}); write it before the closing comment")
    print(f"{sys.argv[1]}: OK" + (f" ({len(warned)} edit warning(s) above)" if warned else ""))


if __name__ == "__main__":
    main()
