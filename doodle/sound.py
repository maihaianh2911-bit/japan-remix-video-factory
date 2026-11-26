"""The sound and the last files of a drawn video: voice + small sounds + music, joined to the picture.

    python -m doodle.sound doodle/stories/<name>

Reads <story>/story.json ("music": {"file", "title", "volume"}, "sounds": [{"line", "at"?, "shift"?, "sound"}]),
<story>/out/voice.wav, timing.json and picture.mp4 (doodle/voice.py, doodle/render.js); writes out/video.mp4,
out/subtitles.srt and out/cover.jpg (the first frame). The music sits about 17 dB under the voice, as in the
other videos (news/render.py); the small sounds (pop, thud, whoosh) are made here, by sums of sines and noise, and stay well under the voice
(a pop at a quarter of its loud moments, a thud at a third, a whoosh at an eighth)."""
import json
from pathlib import Path
import subprocess
import sys
import wave

import numpy as np

RATE = 48000
PAUSES = "、。！？"


def pop():
    t = np.arange(int(RATE * 0.09)) / RATE
    return 0.25 * np.sin(2 * np.pi * (520 * t - 1400 * t * t)) * np.exp(-t * 45)


def thud():
    t = np.arange(int(RATE * 0.26)) / RATE
    low = np.sin(2 * np.pi * (120 * t - 130 * t * t)) * np.exp(-t * 16)
    click = np.random.default_rng(3).standard_normal(t.size) * np.exp(-t * 220) * 0.25
    return 0.36 * (low + click) / 1.25


def whoosh():
    n = int(RATE * 1.1)
    noise = np.random.default_rng(5).standard_normal(n)
    spectrum = np.fft.rfft(noise)
    freq = np.fft.rfftfreq(n, 1 / RATE)
    spectrum *= np.exp(-((np.log(np.maximum(freq, 1) / 900)) ** 2) / 0.9)   # a soft band round 900 Hz
    band = np.fft.irfft(spectrum, n)
    band /= np.abs(band).max()
    return 0.13 * band * np.hanning(n) ** 1.5


SOUNDS = {"pop": pop, "thud": thud, "whoosh": whoosh}


def moment(timing, cue):
    line = timing["lines"][cue["line"]]
    at = line["chars"][line["text"].index(cue["at"])][0] if cue.get("at") else 0.0
    return line["start"] + at + cue.get("shift", 0.0)


def loudness(path, seconds):
    """Integrated loudness (LUFS) of the first `seconds` of a file."""
    done = subprocess.run(["ffmpeg", "-hide_banner", "-t", str(seconds), "-i", str(path), "-af",
                           "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    return float(json.loads(done.stderr[done.stderr.rindex("{"):])["input_i"])


def srt_time(seconds):
    ms = round(seconds * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def subtitles(timing):
    """One caption for every stretch between two pauses of the voice (joined while they stay short)."""
    captions = []
    for line in timing["lines"]:
        text, chars, start = line["text"], line["chars"], line["start"]
        pieces, first = [], 0
        for index, char in enumerate(text):
            if char in PAUSES or index == len(text) - 1:
                pieces.append((first, index + 1))
                first = index + 1
        joined = []
        for begin, end in pieces:
            if joined and end - joined[-1][0] <= 22:
                joined[-1] = (joined[-1][0], end)
            else:
                joined.append((begin, end))
        for number, (begin, end) in enumerate(joined):
            stop = start + chars[joined[number + 1][0]][0] if number + 1 < len(joined) else line["end"]
            shown = text[begin:end].strip("、")
            if shown.strip("。「」"):
                captions.append((start + chars[begin][0] if number else start, stop, shown))
    return "".join(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n\n" for n, (a, b, text) in enumerate(captions, 1))


def main():
    folder = Path(sys.argv[1])
    out = folder / "out"
    story = json.loads((folder / "story.json").read_text(encoding="utf-8"))
    timing = json.loads((out / "timing.json").read_text(encoding="utf-8"))
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                            str(out / "picture.mp4")], capture_output=True, text=True, check=True)
    total = float(probe.stdout.strip())
    # the small sounds on one track
    track = np.zeros(int(RATE * total) + RATE)
    with wave.open(str(out / "voice.wav")) as file:   # the small sounds are sized on the voice: its loud moments are 1
        voice = np.frombuffer(file.readframes(file.getnframes()), "<i2") / 32768
    level = float(np.quantile(np.abs(voice), 0.999))
    for cue in story.get("sounds") or []:
        sound = SOUNDS[cue["sound"]]() * level * cue.get("volume", 1.0)
        first = int(RATE * max(0.0, moment(timing, cue)))
        track[first:first + sound.size] += sound[:max(0, track.size - first)]
    with wave.open(str(out / "sounds.wav"), "wb") as file:
        file.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        file.writeframes((np.clip(track, -1, 1) * 32767).astype("<i2").tobytes())
    inputs = ["-i", str(out / "picture.mp4"), "-i", str(out / "voice.wav"), "-i", str(out / "sounds.wav")]
    chain = ["[1:a]aresample=48000,apad[v]", "[2:a]anull[s]"]
    mixed = "[v][s]"
    count = 2
    music = story.get("music")
    if music:
        voice_lufs, music_lufs = loudness(out / "voice.wav", total), loudness(music["file"], total)
        gain = (voice_lufs - 17.0) - music_lufs + 20 * np.log10(music.get("volume", 1.0))
        print(f"voice {voice_lufs:.1f} LUFS, music {music_lufs:.1f} LUFS: music gain {gain:+.1f} dB")
        inputs += ["-i", music["file"]]
        chain.append(f"[3:a]aresample=48000,pan=mono|c0=0.5*c0+0.5*c1,atrim=0:{total:.3f},volume={gain:.2f}dB,"
                     f"afade=t=in:st=0:d=0.8,afade=t=out:st={total - 2.2:.3f}:d=2.2[m]")
        mixed += "[m]"
        count = 3
    chain.append(f"{mixed}amix=inputs={count}:normalize=0:duration=longest,atrim=0:{total:.3f},"
                 f"loudnorm=I=-14:TP=-2.5:LRA=11,aresample=48000[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chain), "-map", "0:v", "-map", "[a]",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.3f}", "-movflags", "+faststart",
                    str(out / "video.mp4")], check=True)
    (out / "subtitles.srt").write_text(subtitles(timing), encoding="utf-8")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "picture.mp4"), "-frames:v", "1", "-q:v", "2",
                    str(out / "cover.jpg")], check=True)
    print(f"video: {total:.1f} s -> {out / 'video.mp4'}")


if __name__ == "__main__":
    main()
