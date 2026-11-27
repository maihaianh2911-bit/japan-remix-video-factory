"""The posting caption of a video: captions/<story name>.txt, published as <name>/caption.txt beside video.mp4.

python -m news.captions captions/<name>.txt   checks one caption file (no other dependency than Python)

Format (owner, 16/11/2026), UTF-8, Japanese, at most 2000 characters:
    line 1        a hook title, at most 80 characters, true to the script
    lines 2-5     2 to 4 short sentences on the video (one block, no blank line inside)
    blank line
    (optional)    a note of 1 to 3 lines, each starting with ※, then a blank line: the correction of a video that tells
                  a rumour (owner, 19/11/2026, k10: "đc dùng tin đồn, sẽ đính chính ở caption"), e.g.
                  ※動画内の〇〇の話は噂として伝えられているもので、事実とは確認されていません。
    one line      5 to 8 hashtags, among them every hashtag of the channel ("hashtags" in channels/<id>.json, e.g.
                  #世界の王室 #王室 #shorts for k10), then the ones of the story
    blank line
    last line     the credit line, starting with 画像出典 (e.g. 画像出典: … ／ 詳しくは credits.txt; say 元動画 when
                  pictures of the source video are used)
The channel is read from the file name, which is the story's: k10-2026-11-19-diana.txt (a sample: mau-k10.txt).
The caption of a trial (its story, stories/<name>.json beside captions/, carries "trial": true) need not carry the
channel's hashtags: a trial is not a video of the channel (27/11/2026, the trial videos that explain a style of art,
kept under k10 until they have a channel: 世界の王室 would be wrong on them). Everything else is checked the same.
"""
import json
from pathlib import Path
import re
import sys

from . import channels

LIMIT, TITLE_LIMIT = 2000, 80
HASHTAG = re.compile(r"^#[^\s#]+$")
NOTE = "※"


def caption_path(story_path):
    """captions/<name>.txt of stories/<name>.json (the folders sit side by side in the repository)."""
    story_path = Path(story_path)
    return story_path.parent.parent / "captions" / f"{story_path.stem}.txt"


def problems(text, required=()):
    """The problems of a caption (empty when it is usable); `required`: the hashtags of its channel."""
    found = []
    if len(text) > LIMIT:
        found.append(f"the caption has {len(text)} characters, at most {LIMIT}")
    blocks = [block.strip("\n") for block in re.split(r"\n[ \t　]*\n", text.strip("\n"))]
    if len(blocks) == 4 and blocks[1].lstrip().startswith(NOTE):
        note = blocks.pop(1).split("\n")
        if len(note) > 3 or not all(line.strip().startswith(NOTE) for line in note):
            found.append(f"the note after the sentences is 1 to 3 lines, each starting with {NOTE}, got {note!r}")
    if len(blocks) != 3:
        return found + [f"the caption must be 3 blocks separated by one blank line (title and sentences / hashtags / "
                        f"credit line; a note of lines starting with {NOTE} may come between the sentences and the "
                        f"hashtags), found {len(blocks)}"]
    head, tags, credit = blocks
    lines = head.split("\n")
    title, sentences = lines[0].strip(), [line for line in lines[1:] if line.strip()]
    if not title:
        found.append("line 1 (the title) is empty")
    elif len(title) > TITLE_LIMIT:
        found.append(f"line 1 (the title) has {len(title)} characters, at most {TITLE_LIMIT}")
    if not 1 <= len(sentences) <= 4 or not 2 <= sum(max(1, line.count("。")) for line in sentences) <= 4:
        found.append(f"after the title come 2 to 4 short sentences, found {len(sentences)} line(s): {sentences!r}")
    words = tags.split()
    if "\n" in tags.strip() or not all(HASHTAG.match(word) for word in words):
        found.append(f"the hashtags are one line of #words separated by spaces, got {tags!r}")
    elif not 5 <= len(words) <= 8:
        found.append(f"5 to 8 hashtags, found {len(words)}")
    elif len(set(words)) != len(words):
        found.append("a hashtag appears twice")
    if missing := [tag for tag in required if tag not in words]:
        found.append(f"the hashtags of the channel are missing: {' '.join(missing)} (every caption of the channel "
                     f"carries {' '.join(required)})")
    if "\n" in credit or not credit.startswith("画像出典"):
        found.append(f"the last line is the credit line, starting with 画像出典, got {credit!r}")
    return found


def of_trial(path):
    """True when the story of this caption (stories/<name>.json beside the captions folder) is a trial."""
    story = Path(path).resolve().parent.parent / "stories" / f"{Path(path).stem}.json"
    try:
        data = json.loads(story.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    return isinstance(data, dict) and data.get("trial") is True


def check(path):
    path = Path(path)
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return [f"{path}: not UTF-8"]
    channel = channels.get(channels.of_name(path.stem))
    if channel is None:
        return [f"{path}: a caption is named after its story, <channel>-<YYYY-MM-DD>-<short>.txt (a sample: "
                f"mau-<channel>.txt) with a channel of channels/ ({', '.join(channels.ids())}), e.g. "
                "k10-2026-11-19-diana.txt"]
    required = () if of_trial(path) else channel["hashtags"]
    return [f"{path}: {problem}" for problem in problems(text, required)]


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: python -m news.captions captions/<name>.txt")
    found = check(sys.argv[1])
    if found:
        sys.exit("error: " + "\n  - ".join([f"{len(found)} caption problem(s):"] + found))
    print(f"{sys.argv[1]}: OK")


if __name__ == "__main__":
    main()
