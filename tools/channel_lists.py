"""The list of each channel's videos on the renders branch: kenh-<number>.md at its top level, newest first, one line
a video with links to the video, its posting caption, its subtitles and its picture credits, so that the owner can
download a channel's videos from one page (https://github.com/<repo>/blob/renders/kenh-8.md).

Written by tools/publish.sh after every publish and by the weekly clean-up (renders-cleanup.yml), from what the branch
holds: a folder <channel>-<YYYY-MM-DD>-<short>/ with a video.mp4 is a video of that channel (finished or not: the
list says nothing about the issue). Python standard library only.

python tools/channel_lists.py <renders folder> <channels folder>
"""
import json
from pathlib import Path
import re
import sys

NAME = re.compile(r"^(k[1-9][0-9]*)-([0-9]{4}-[0-9]{2}-[0-9]{2})-[A-Za-z0-9._-]+$")
MARKDOWN = re.compile(r"([\\`*_\[\]<>|])")
FILES = (("caption.txt", "caption"), ("subtitles.srt", "phụ đề"), ("credits.txt", "nguồn ảnh"))


def read_json(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def title_of(folder):
    """The hook title of the posting caption (its first line), else the story's title, else the folder name."""
    try:
        first = (folder / "caption.txt").read_text(encoding="utf-8").strip().splitlines()[0].strip()
    except (OSError, UnicodeDecodeError, IndexError):
        first = ""
    return first or (read_json(folder / "sources.json").get("release") or {}).get("title") or folder.name


def entry(folder):
    """One line of the list."""
    sources = read_json(folder / "sources.json")
    seconds = sources.get("duration_seconds")
    length = f" ({round(seconds) // 60}:{round(seconds) % 60:02d})" if isinstance(seconds, (int, float)) else ""
    links = [f"[video]({folder.name}/video.mp4)"] + [f"[{label}]({folder.name}/{name})" for name, label in FILES
                                                     if (folder / name).exists()]
    trial = " · *thử*" if sources.get("trial") else ""
    title = MARKDOWN.sub(r"\\\1", title_of(folder))
    return f"- {NAME.match(folder.name)[2]} · **{title}**{length}{trial} — " + " · ".join(links)


def page(channel, videos):
    head = [f"# Kênh {channel['number']} · {channel['name_ja']} ({channel['name_vi']})", "",
            "Video của kênh, mới nhất ở trên. Bấm **video**, rồi nút tải về (Download raw file) để lưu video; "
            "**caption** là lời giới thiệu để đăng kèm video, **nguồn ảnh** để dán vào phần mô tả.", "",
            "Video bị xóa khỏi đây 2 ngày sau khi đóng phiếu, hoặc sau 14 ngày phiếu không có hoạt động: hãy tải về sớm.",
            ""]
    return "\n".join(head + ([entry(folder) for folder in videos] or ["_Chưa có video nào._"])) + "\n"


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: python tools/channel_lists.py <renders folder> <channels folder>")
    renders, folder = Path(sys.argv[1]), Path(sys.argv[2])
    folders = [path for path in renders.iterdir() if path.is_dir() and NAME.match(path.name)
               and (path / "video.mp4").is_file()]
    for path in sorted(folder.glob("*.json")):
        channel = read_json(path)
        if not all(key in channel for key in ("id", "number", "name_ja", "name_vi")):
            print(f"skipped {path.name}: not a channel file")
            continue
        videos = sorted((video for video in folders if NAME.match(video.name)[1] == channel["id"]),
                        key=lambda video: (NAME.match(video.name)[2],
                                           read_json(video / "status.json").get("published_utc", ""), video.name),
                        reverse=True)
        (renders / f"kenh-{channel['number']}.md").write_text(page(channel, videos), encoding="utf-8")
        print(f"kenh-{channel['number']}.md: {len(videos)} video(s)")


if __name__ == "__main__":
    main()
