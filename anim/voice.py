"""The voice of an animated trial: VOICEVOX reads every line, and the real moment of every caption is kept.

    python anim/voice.py anim/trials/<name>.json <out folder>

Writes <out>/voice.wav and <out>/timing.json (the start and end of every line and of every caption chunk, in
seconds), which the animation follows. A chunk is one caption: "[...]" marks its gold words, "\n" its row break.
"""
import json
import sys
import wave
from io import BytesIO
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from news.voice import request, speaker_id, spoken_times  # noqa: E402

RATE = 24000


def plain(chunk):
    return chunk.replace("[", "").replace("]", "").replace("\n", "")


def main(story_path, out):
    story = json.loads(Path(story_path).read_text(encoding="utf-8"))
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    speaker = speaker_id(story["voice"]["speaker"], story["voice"]["style"])
    pace = story.get("pace", {})
    position, lines = 0.0, []
    with wave.open(str(out / "voice.wav"), "wb") as output:
        output.setparams((1, 2, RATE, 0, "NONE", "not compressed"))

        def silence(seconds):
            nonlocal position
            frames = round(RATE * seconds)
            output.writeframesraw(b"\x00\x00" * frames)
            position += frames / RATE

        silence(0.25)   # the picture is there a moment before the first word
        for line in story["lines"]:
            texts = [plain(chunk) for chunk in line["chunks"]]
            text = line.get("say") or "".join(texts)
            query = json.loads(request("/audio_query", params={"text": text, "speaker": speaker}, data=b""))
            query.update(speedScale=pace.get("speed", 1.2), prePhonemeLength=0.07, postPhonemeLength=0.12,
                         pauseLengthScale=0.72, outputSamplingRate=RATE, outputStereo=False)
            wav = request("/synthesis", params={"speaker": speaker}, data=json.dumps(query).encode())
            with wave.open(BytesIO(wav)) as segment:
                duration = segment.getnframes() / RATE
                output.writeframesraw(segment.readframes(segment.getnframes()))
            times = None if line.get("say") else spoken_times("".join(texts), query, duration)
            chunks, offset = [], 0
            for number, (chunk, shown) in enumerate(zip(line["chunks"], texts)):
                if times:
                    begin = next((b for b, e in times[offset:offset + len(shown)] if e > b), times[offset][0])
                    start = position + (max(0.0, begin - 0.08) if number else 0.0)
                else:
                    start = position + duration * offset / max(1, sum(map(len, texts)))
                chunks.append({"text": chunk, "start": round(start, 3)})
                offset += len(shown)
            for number, chunk in enumerate(chunks):
                chunk["end"] = chunks[number + 1]["start"] if number + 1 < len(chunks) else round(position + duration, 3)
            reading = "".join(mora["text"] for phrase in query["accent_phrases"] for mora in phrase["moras"])
            lines.append({"id": line["id"], "start": round(position, 3), "end": round(position + duration, 3),
                          "chunks": chunks, "reading": reading})
            position += duration
            silence(pace.get("line_pause", 0.1))
        silence(0.9)    # the last picture stays a moment
    timing = {"duration": round(position, 3), "tag": story.get("tag"), "title": story.get("title"), "lines": lines}
    (out / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=1), encoding="utf-8")
    for line in lines:
        print(f"{line['start']:6.2f}–{line['end']:6.2f}  {line['id']:5} {line['reading']}")
    print(f"total {position:.2f} s")


if __name__ == "__main__":
    main(*sys.argv[1:3])
