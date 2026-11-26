"""The channels this repository makes videos for: channels/<id>.json (k8, k9, k10 and k11 since 18/11/2026).

A channel file holds
    id, number        "k8", 8: a story of the channel is stories/k8-<YYYY-MM-DD>-<short>.json with "channel": "k8",
                      its sample stories/mau-k8.json; its videos are listed in kenh-8.md on the renders branch
    name_ja, name_vi  the channel's names, in Japanese and in Vietnamese
    tag               what the titles of its issues start with: "[K8]"
    voice             its VOICEVOX voice, {"speaker": …, "style": …}: the narration and the credit VOICEVOX:<speaker>
    hashtags          the hashtags every posting caption of the channel carries (captions/<story>.txt)
    edit              "tin-nhat": the channel edits as the Tin Nhật channel of japan-news-video-factory does (owner,
                      18/11/2026: "cho 4 kênh này học cách edit của kênh tin nhật"): the story frame, the four picture
                      effects, music, the hook line printed big, two pictures for a scene over 6 seconds, a move for every picture, a cut
                      and a why for every scene, the picture review. python -m news.custom warns about what a story
                      leaves out of it (custom.edit_warnings).
    defaults          what a story of the channel inherits for the keys it leaves out: style, kicker, pace, fx, and
                      music (a recording kept in music/, {"file": …, "title": …}: k10's bamboo flute, 25/11/2026),
                      audio ({"loudness": 1.6, "voice": 1.3}: the whole sound 60 % louder, the voice 30 % louder over
                      the music; k10, owner 26/11/2026). A dict ("pace", "fx", "audio") is inherited key by key,
                      "music" whole; a key set to null inherits nothing.
Only the Python standard library is used here: the caption check runs without the requirements.

python -m news.channels                          checks every channel file (and the stories its defaults make)
python -m news.channels --title "<issue title>"  prints "<id>\t<number>\t<name_vi>" of the channel whose tag starts
                                                 the title, or nothing
"""
import copy
from datetime import date
from functools import lru_cache
import json
from pathlib import Path
import re
import sys

FOLDER = Path(__file__).resolve().parent.parent / "channels"
ID = re.compile(r"^k[1-9][0-9]*$")
KEYS = {"id", "number", "name_ja", "name_vi", "tag", "voice", "hashtags", "edit", "defaults"}
DEFAULT_KEYS = {"style", "kicker", "pace", "fx", "music", "audio"}
EDITS = ("tin-nhat",)   # the edits a channel may follow (CLAUDE.md, "The edit")
STORY_NAME = re.compile(r"^(k[1-9][0-9]*)-([0-9]{4}-[0-9]{2}-[0-9]{2})-[A-Za-z0-9._-]+$")
SAMPLE_NAME = re.compile(r"^mau-(k[1-9][0-9]*)(?:-[A-Za-z0-9._-]+)?$")
HASHTAG = re.compile(r"^#[^\s#]+$")


@lru_cache(maxsize=1)
def channels():
    """Every channel file by its id, in the order of their numbers (a file that cannot be read is left out here;
    check() reports it)."""
    found = []
    for path in FOLDER.glob("*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if isinstance(data, dict):
            found.append((data.get("number") if isinstance(data.get("number"), int) else 0, path.stem, data))
    return {stem: data for _, stem, data in sorted(found, key=lambda item: item[:2])}


def get(channel_id):
    """The channel of that id ("k8"), or None."""
    return channels().get(channel_id) if isinstance(channel_id, str) else None


def ids():
    return list(channels())


def of_name(name):
    """The channel a story or caption file name names: "k8-2026-11-19-todai" and "mau-k8" → "k8"; else None."""
    match = STORY_NAME.match(name or "") or SAMPLE_NAME.match(name or "")
    return match[1] if match else None


def name_problems(name, channel_id):
    """The problems of the file name of a story of that channel (empty when it is right)."""
    story, sample = STORY_NAME.match(name), SAMPLE_NAME.match(name)
    if not story and not sample:
        return [f"file name {name!r}: a story of channel {channel_id} is named {channel_id}-<YYYY-MM-DD>-<short name>, "
                f"e.g. {channel_id}-2026-11-19-todai-sotsu.json (a sample of the channel: mau-{channel_id}.json)"]
    problems = []
    if (story or sample)[1] != channel_id:
        problems.append(f"file name {name!r} names channel {(story or sample)[1]}, but the story says "
                        f'"channel": {channel_id!r}: the name must start with the story\'s channel')
    if story:
        try:
            date.fromisoformat(story[2])
        except ValueError:
            problems.append(f"file name {name!r}: {story[2]!r} is not a date (YYYY-MM-DD)")
    return problems


def of_title(title):
    """The channel whose tag starts an issue title, in any case ("[k8] …" is channel k8; "[K1]" never matches
    "[K10] …"), or None."""
    text = (title or "").strip().upper()
    return next((data for data in channels().values()
                 if isinstance(data.get("tag"), str) and data["tag"] and text.startswith(data["tag"].upper())), None)


def inherit(story):
    """The story with its channel's defaults in the keys it leaves out. A dict ("pace", "fx") is inherited key by
    key, so that a story may change one of them ("fx": {"depth": false}); a key set to null inherits nothing. The
    channel's "music" (a recording in music/) is taken whole, and a story's own "music" replaces it whole."""
    channel = get(story.get("channel")) if isinstance(story, dict) else None
    if not channel or not isinstance(channel.get("defaults"), dict):
        return story
    merged = dict(story)
    for key, value in channel["defaults"].items():
        if key not in merged:
            merged[key] = copy.deepcopy(value)
        elif isinstance(value, dict) and isinstance(merged[key], dict) and key != "music":   # music: whole
            merged[key] = {**copy.deepcopy(value), **merged[key]}
    return merged


def problems(data, stem):
    """The problems of one channel file (empty when it is usable)."""
    if not isinstance(data, dict):
        return [f"channels/{stem}.json must be a JSON object"]
    where = f"channels/{stem}.json"
    found = [f"{where}: unknown key {key!r} (allowed: {', '.join(sorted(KEYS))})" for key in sorted(set(data) - KEYS)]
    found += [f"{where}: {key!r} is missing" for key in sorted(KEYS - set(data))]
    number = data.get("number")
    if not ID.match(stem) or data.get("id") != stem:
        found.append(f'{where}: "id" must be the file name, k<number> (e.g. "k8"), got {data.get("id")!r}')
    if not isinstance(number, int) or isinstance(number, bool) or f"k{number}" != stem:
        found.append(f'{where}: "number" must be the number of the id ({stem} → {stem[1:]}), got {number!r}')
    elif data.get("tag") != f"[K{number}]":
        found.append(f'{where}: "tag" must be "[K{number}]" (what the issue titles start with), got {data.get("tag")!r}')
    for key in ("name_ja", "name_vi"):
        if not isinstance(data.get(key), str) or not data[key].strip():
            found.append(f'{where}: "{key}" must be a non-empty string, got {data.get(key)!r}')
    voice = data.get("voice")
    if (not isinstance(voice, dict) or set(voice) != {"speaker", "style"}
            or not all(isinstance(value, str) and value.strip() for value in voice.values())):
        found.append(f'{where}: "voice" must be {{"speaker": "<VOICEVOX speaker>", "style": "<style>"}}, got {voice!r}')
    tags = data.get("hashtags")
    if (not isinstance(tags, list) or not 1 <= len(tags) <= 4 or len(set(map(str, tags))) != len(tags)
            or not all(isinstance(tag, str) and HASHTAG.match(tag) for tag in tags)):
        found.append(f'{where}: "hashtags" must be 1 to 4 different hashtags (a caption has 5 to 8 in all), '
                     f"got {tags!r}")
    if data.get("edit") not in EDITS:
        found.append(f'{where}: "edit" must be one of {", ".join(EDITS)} (the edit the channel follows), '
                     f"got {data.get('edit')!r}")
    defaults = data.get("defaults")
    if not isinstance(defaults, dict):
        found.append(f'{where}: "defaults" must be an object (style, kicker, pace, fx, music, audio), got {defaults!r}')
    else:
        found += [f'{where}: "defaults" cannot hold {key!r} (allowed: {", ".join(sorted(DEFAULT_KEYS))})'
                  for key in sorted(set(defaults) - DEFAULT_KEYS)]
    return found


def check():
    """Every channel file: its own problems, then a minimal story of the channel through the story check (so that a
    wrong default, such as an unknown style, shows here and not in a story)."""
    from .custom import validate   # needs Pillow: only the full check uses it
    found, tags = [], {}
    paths = sorted(FOLDER.glob("*.json"))
    if not paths:
        found.append(f"no channel files in {FOLDER}")
    for path in paths:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError) as error:
            found.append(f"channels/{path.name}: not valid JSON: {error}")
            continue
        mine = problems(data, path.stem)
        found += mine
        if mine:
            continue
        if data["tag"].upper() in tags:
            found.append(f"channels/{path.name}: tag {data['tag']} is also the tag of {tags[data['tag'].upper()]}")
        tags[data["tag"].upper()] = path.stem
        sample = {"channel": path.stem, "title": "見本", "date": "2026-01-01",
                  "scenes": [{"headline": "見本", "lines": ["見本です。"]}]}
        found += [f"channels/{path.name}, its defaults: {problem}" for problem in validate(sample, f"mau-{path.stem}")]
    return found


def main():
    if sys.argv[1:2] == ["--title"] and len(sys.argv) == 3:
        channel = of_title(sys.argv[2])
        if channel:
            print(f"{channel['id']}\t{channel['number']}\t{channel['name_vi']}")
        return
    if len(sys.argv) != 1:
        sys.exit('usage: python -m news.channels  |  python -m news.channels --title "<issue title>"')
    if found := check():
        sys.exit("error: " + "\n  - ".join([f"{len(found)} channel problem(s):"] + found))
    print("channels: " + ", ".join(f"{data['id']} {data['tag']} {data['name_ja']} "
                                   f"(VOICEVOX:{data['voice']['speaker']}/{data['voice']['style']})"
                                   for data in channels().values()) + ": OK")


if __name__ == "__main__":
    main()
