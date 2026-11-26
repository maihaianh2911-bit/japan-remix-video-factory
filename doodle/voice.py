"""The voice of a drawn story: every line read by VOICEVOX, one after the other, and when each character is said.

    python -m doodle.voice doodle/stories/<name> [--out <folder>]

Reads <story>/story.json ("voice": {"speaker", "style"}, "pace": {"speed", "line_pause", "scene_pause"}, "lines":
[{"text", "say"?, "end"?}]) and writes voice.wav and timing.json into the out folder (default <story>/out).
timing.json: {"duration", "lines": [{"text", "start", "end", "chars": [[begin, end], …]}]} — "chars" are seconds from
the start of the line, one pair for every character of "text" (the real moments, from the lengths of the sounds
VOICEVOX gives; an even share of the line when they cannot be laid side by side). The drawings are timed on them.
The voice is made as in news/voice.py (same engine settings), so a drawn video sounds like the other videos.
A story under 61 seconds is refused unless it carries "trial": true (the owner's rule for every video)."""
import argparse
from io import BytesIO
import json
from pathlib import Path
import sys
import wave

from news.voice import request, speaker_id, spoken_times

RATE = 24000
MINIMUM = 61.0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("story")
    parser.add_argument("--out")
    args = parser.parse_args()
    folder = Path(args.story)
    story = json.loads((folder / "story.json").read_text(encoding="utf-8"))
    out = Path(args.out) if args.out else folder / "out"
    out.mkdir(parents=True, exist_ok=True)
    pace = story.get("pace") or {}
    speed, line_pause, scene_pause = pace.get("speed", 1.2), pace.get("line_pause", 0.1), pace.get("scene_pause", 0.2)
    speaker = speaker_id(story["voice"]["speaker"], story["voice"]["style"])
    lines, position = [], 0.0
    with wave.open(str(out / "voice.wav"), "wb") as output:
        output.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        for line in story["lines"]:
            text = line["text"]
            query = json.loads(request("/audio_query", params={"text": line.get("say", text), "speaker": speaker}, data=b""))
            query.update(speedScale=speed, prePhonemeLength=0.07, postPhonemeLength=0.12,
                         pauseLengthScale=0.72, outputSamplingRate=RATE, outputStereo=False)
            sound = request("/synthesis", params={"speaker": speaker}, data=json.dumps(query).encode())
            with wave.open(BytesIO(sound)) as segment:
                frames = segment.getnframes()
                output.writeframesraw(segment.readframes(frames))
            duration = frames / RATE
            times = None
            # the voice also pauses at a bracket: try the text as it is, then with its brackets read as pauses
            for written in (text, text.translate(str.maketrans("「」『』", "、、、、"))):
                try:
                    times = spoken_times(written, query, duration)
                except (AttributeError, KeyError, TypeError, ValueError):
                    times = None
                if times:
                    break
            exact = bool(times)
            if not times:   # an even share of the line for every character
                times = [(duration * index / len(text), duration * (index + 1) / len(text)) for index in range(len(text))]
            lines.append({"text": text, "start": round(position, 3), "end": round(position + duration, 3),
                          "exact": exact, "kana": query.get("kana", ""),
                          "chars": [[round(begin, 3), round(end, 3)] for begin, end in times]})
            position += duration
            pause = line_pause + (scene_pause if line.get("end") else 0.0)
            output.writeframesraw(b"\x00\x00" * round(RATE * pause))
            position += round(RATE * pause) / RATE
    timing = {"duration": round(position, 3), "voice": story["voice"], "lines": lines}
    (out / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=1), encoding="utf-8")
    for number, line in enumerate(lines):
        print(f"{number:2d} {line['start']:6.2f}-{line['end']:6.2f} {'exact' if line['exact'] else 'even '} {line['text']}")
    print(f"voice: {position:.1f} s")
    if position < MINIMUM and not story.get("trial"):
        sys.exit(f"the voice is {position:.1f} s: under {MINIMUM:.0f} s. Write the script longer (true details), then run again.")


if __name__ == "__main__":
    main()
