"""Make the video of a story: stories/<channel>-<YYYY-MM-DD>-<short>.json, voiced with its channel's voice.

python -m news --story stories/<name>.json --pictures <find folder> --stills <folder>   one still per picture
python -m news --story stories/<name>.json --pictures <find folder> [--out dist]         voice and video (VOICEVOX)

(The daily, demo and release-URL modes of japan-news-video-factory, which read the Bank of Japan and METI, are not
part of this repository: every video here is a story.)
"""
import argparse
from dataclasses import asdict
import json
import os
from pathlib import Path
import tempfile
import wave

from .custom import StoryError, load_story
from .render import encode, stills, use_fx, use_style, write_subtitles
from .story import voice_credit
from .voice import narration

# Iron rules 2 and 3 (CLAUDE.md): never a video under 60 seconds; every video 80 to 160 seconds. A trial or sample
# video ("trial": true in the story) is the exception.
MINIMUM, SHORTEST, LONGEST = 60.0, 80.0, 160.0


def summary(message, ready=None):
    """A line of the run summary; `ready` (true when the video is made) also sets the step output."""
    print(message)
    if summary_path := os.environ.get("GITHUB_STEP_SUMMARY"):
        with Path(summary_path).open("a", encoding="utf-8") as output:
            output.write(message + "\n")
    if ready is not None and (output_path := os.environ.get("GITHUB_OUTPUT")):
        with Path(output_path).open("a", encoding="utf-8") as output:
            output.write(f"ready={'true' if ready else 'false'}\n")


def refuse(why, message):
    """Stop before the video is made; on GitHub the issue's failure comment gives `why` (Vietnamese)."""
    if env_path := os.environ.get("GITHUB_ENV"):
        with Path(env_path).open("a", encoding="utf-8") as output:
            output.write(f"WHY={why}\n")
    raise SystemExit(f"error: {message}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--story", type=Path, required=True, help="A story, stories/<name>.json")
    parser.add_argument("--pictures", type=Path, help="Folder of the pictures found for the story")
    parser.add_argument("--stills", type=Path, help="Only save one frame per picture of the story here")
    parser.add_argument("--out", type=Path, default=Path("dist"))
    parser.add_argument("--plan-only", action="store_true", help="Print the Japanese script and stop")
    args = parser.parse_args()
    try:
        release, beats, scene_photos = load_story(args.story, args.pictures)
    except StoryError as error:
        raise SystemExit(f"error: {error}") from None
    use_style(release.style)
    use_fx(release.fx)
    if args.stills:
        args.stills.mkdir(parents=True, exist_ok=True)
        stills(beats, release, scene_photos, args.stills)
        return
    script = "\n\n".join("\n".join(beat.lines) for beat in beats) + "\n"
    print(f"{release.channel} | {release.title} | {voice_credit(release)}/{release.voice[1]}")
    if args.plan_only:
        print(script)
        return

    photos = [photo for scene in scene_photos.values() for photo in scene]
    for photo in photos:
        print(f"Archival photo: {photo.page} ({photo.license})")

    args.out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="news-") as scratch:
        wav = Path(scratch) / "voice.wav"
        intervals, captions = narration(beats, wav, speed=release.speed, line_pause=release.line_pause,
                                        exact=bool((getattr(release, "fx", None) or {}).get("text")),
                                        scene_pause=release.scene_pause, voice=release.voice)
        duration = intervals[-1][1]
        if duration < MINIMUM and not release.trial:
            refuse(f"lời đọc chỉ dài {duration:.0f} giây, dưới 60 giây (luật thép số 2): cần viết kịch bản dài hơn "
                   "rồi dựng lại", f"the narration is {duration:.1f} s, under {MINIMUM:.0f} s (iron rule 2): write "
                   'the story longer (a trial or sample video carries "trial": true)')
        if not SHORTEST <= duration <= LONGEST and not release.trial:
            print(f"::warning::the narration is {duration:.1f} s, outside {SHORTEST:.0f}-{LONGEST:.0f} s (iron rule 3)")
            summary(f"⚠️ Lời đọc dài {duration:.0f} giây, ngoài khoảng 80–160 giây (luật thép số 3): sửa kịch bản "
                    "rồi dựng lại trước khi giao.")
        with wave.open(str(wav)) as voice:
            if voice.getnframes() == 0:
                raise RuntimeError("No voice audio produced")
        encode(beats, release, scene_photos, False, intervals, captions, wav, args.out)
    write_subtitles(captions, args.out / "subtitles.srt")
    (args.out / "script-ja.txt").write_text(script, encoding="utf-8")
    report = {
        "channel": release.channel,
        "trial": release.trial,
        "duration_seconds": round(duration, 2),
        "release": {"url": release.url, "published": release.published.isoformat(),
                    "publisher": release.publisher, "title": release.title},
        "photos": [photo.credit() for photo in photos],
        "voice_credit": voice_credit(release),
        "voice": {"speaker": release.voice[0], "style": release.voice[1]},
        "music": release.music.credit() if release.music else None,
        "scenes": [
            dict(asdict(beat),
                 visual=beat.visual if index in scene_photos or beat.visual != "photo" else "document",
                 image_url=scene_photos[index][0].page if index in scene_photos else None,
                 image_urls=[photo.page for photo in scene_photos.get(index, [])])
            for index, beat in enumerate(beats)
        ],
    }
    (args.out / "sources.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary(f"{release.channel} · {release.title} · {duration:.1f} s · {len(beats)} cảnh · "
            f"{len(report['photos'])} ảnh · {voice_credit(release)}", True)


if __name__ == "__main__":
    main()
