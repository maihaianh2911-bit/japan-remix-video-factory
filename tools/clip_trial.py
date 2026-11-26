"""A trial of a new kind of video: short video clips instead of still pictures, with big captions in the middle of
the screen (the style of the source the owner sent on 26/11/2026). A trial only, kept apart from the engine
(`news/`) until the owner approves it: the engine changes only after that.

    python tools/clip_trial.py find   trials/<name>.json <out>   # Pixabay searches → sheets of candidates
    python tools/clip_trial.py render trials/<name>.json <out>   # the voice (VOICEVOX at 127.0.0.1:50021) + the video

The clips come from Pixabay (free licence, no credit required; credited all the same in credits.txt); the key is
the secret PIXABAY_API_KEY. AI-generated clips are allowed (owner, 26/11/2026: "K cần bỏ video AI, m đc phép
dùng"); the sheet marks them "AI" so that each can be looked at.
"""
import json
import os
import subprocess
import sys
import urllib.parse
import urllib.request
import wave
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from news.render import reading_weight              # noqa: E402
from news.voice import request, speaker_id, spoken_times   # noqa: E402

W, H, FPS = 1080, 1920, 30
RATE = 24000
UA = {"User-Agent": "video-factory-trial"}
ROUNDED = "fonts/MPLUSRounded1c-ExtraBold.ttf"
FALLBACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
WHITE, YELLOW, ORANGE, INK = (255, 255, 255), (255, 225, 53), (255, 140, 26), (20, 20, 20)


def font(size):
    try:
        return ImageFont.truetype(ROUNDED, size)
    except OSError:
        return ImageFont.truetype(FALLBACK, size)


def get(url, timeout=60):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as answer:
        return answer.read()


def pixabay(params):
    key = os.environ.get("PIXABAY_API_KEY", "")
    if not key:
        raise SystemExit("no PIXABAY_API_KEY")
    url = "https://pixabay.com/api/videos/?" + urllib.parse.urlencode({"key": key, **params})
    return json.loads(get(url))


def rendition(hit):
    """The best file of a clip: the large one when there is one, else the medium."""
    videos = hit["videos"]
    for size in ("large", "medium", "small"):
        if videos.get(size, {}).get("url"):
            return videos[size]
    raise ValueError(f"clip {hit['id']} has no file")


# ---------------------------------------------------------------- find

def find(spec, out):
    out.mkdir(parents=True, exist_ok=True)
    index = {}
    for number, words in enumerate(spec["searches"], 1):
        lang = "en" if words.isascii() else "ja"
        hits = pixabay({"q": words, "lang": lang, "per_page": 40, "safesearch": "true"}).get("hits", [])
        # tall clips first, then the sharpest
        hits.sort(key=lambda h: (-(rendition(h)["height"] > rendition(h)["width"]), -rendition(h)["width"]))
        hits = hits[:16]
        tiles = []
        for hit in hits:
            file = rendition(hit)
            entry = {"id": hit["id"], "w": file["width"], "h": file["height"], "seconds": hit["duration"],
                     "ai": bool(hit.get("isAiGenerated")), "tags": hit.get("tags"), "page": hit["pageURL"],
                     "user": hit.get("user"), "url": file["url"]}
            index[str(hit["id"])] = entry
            try:
                thumb = Image.open(BytesIO(get(hit["videos"]["medium"]["thumbnail"]))).convert("RGB")
            except Exception:
                thumb = Image.new("RGB", (320, 320), (60, 60, 60))
            tiles.append((thumb, f"{hit['id']}  {file['width']}x{file['height']}  {hit['duration']}s"
                                 + ("  AI" if entry["ai"] else "")))
        sheet(tiles, f"{number}. {words}  ({len(hits)})", out / f"sheet_{number}.jpg")
    (out / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1))


def sheet(tiles, title, path):
    size, label = 340, 40
    columns = 4
    rows = max(1, (len(tiles) + columns - 1) // columns)
    canvas = Image.new("RGB", (columns * size, 60 + rows * (size + label)), (25, 25, 25))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 10), title, font=font(36), fill=WHITE)
    for n, (thumb, text) in enumerate(tiles):
        x, y = n % columns * size, 60 + n // columns * (size + label)
        thumb.thumbnail((size - 8, size - 8))
        canvas.paste(thumb, (x + (size - thumb.width) // 2, y + (size - thumb.height) // 2))
        draw.text((x + 6, y + size + 4), text, font=font(22), fill=YELLOW if text.endswith("AI") else WHITE)
    canvas.save(path, quality=88)


# ---------------------------------------------------------------- text

def plain(text):
    return text.replace("*", "")


def chunks_of(line, longest=13):
    """The caption pieces of a line, cut at its commas and stops, a long piece cut again near its middle after a
    particle; '*' marks the keyword spans (shown yellow) and stays in the pieces."""
    pieces, current = [], ""
    for char in line:
        if char in "、。！？":
            if plain(current).strip():
                pieces.append(current)
            current = ""
        else:
            current += char
    if plain(current).strip():
        pieces.append(current)
    result = []
    for piece in pieces:
        while len(plain(piece)) > longest:
            middle = len(piece) // 2
            cut = min((i for i in range(len(piece)) if piece[i - 1:i] in "はがをにでのともへ" and 3 < i < len(piece) - 3),
                      key=lambda i: abs(i - middle), default=middle)
            if piece[:cut].count("*") % 2:       # never cut inside a keyword: before it, else after it
                opening = piece.rindex("*", 0, cut)
                cut = opening if len(plain(piece[:opening])) > 3 else piece.index("*", cut) + 1
            result.append(piece[:cut])
            piece = piece[cut:]
        result.append(piece)
    return result


def spans(text):
    """[(text, keyword?)] of a piece with '*' marks."""
    parts = text.split("*")
    return [(part, n % 2 == 1) for n, part in enumerate(parts) if part]


def rows_of(text, per_row):
    letters = plain(text)
    if len(letters) <= per_row:
        return [text]
    count = (len(letters) + per_row - 1) // per_row
    size = (len(letters) + count - 1) // count
    rows, row, seen = [], "", 0
    for char in text:
        row += char
        if char != "*":
            seen += 1
            if seen % size == 0 and seen < len(letters):
                if row.count("*") % 2:           # a keyword going on: close it here, open it on the next row
                    rows.append(row + "*")
                    row = "*"
                else:
                    rows.append(row)
                    row = ""
    rows.append(row)
    return [r for r in rows if plain(r)]


def draw_rows(draw, rows, centre_y, size, colours, stroke):
    face = font(size)
    gap = int(size * 0.22)
    total = len(rows) * size + (len(rows) - 1) * gap
    y = centre_y - total // 2
    for row, base in zip(rows, colours):
        parts = spans(row)
        width = sum(draw.textlength(text, font=face) for text, _ in parts)
        x = (W - width) / 2
        for text, key in parts:
            draw.text((x, y), text, font=face, fill=YELLOW if key else base, stroke_width=stroke, stroke_fill=INK)
            x += draw.textlength(text, font=face)
        y += size + gap


def caption_png(text, path):
    image = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rows = rows_of(text, 10)
    draw_rows(ImageDraw.Draw(image), rows, 1180, 92, [WHITE] * len(rows), 11)
    image.save(path)


def title_png(lines, path, number=None):
    """The big title: the hook's lines, or the number and name of an item."""
    image = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    if number:
        draw_rows(draw, [number], 820, 230, [YELLOW], 14)
        draw_rows(draw, lines, 1080, 120, [WHITE] * len(lines), 13)
    else:
        sizes = [min(150, 900 // max(1, len(plain(line)))) for line in lines]   # every line inside the box
        colours = [WHITE, ORANGE, WHITE, ORANGE]
        y = 520
        box = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        total = sum(sizes) + 40 * (len(lines) - 1)
        ImageDraw.Draw(box).rounded_rectangle((50, y - 50, W - 50, y + total + 50), 40, fill=(0, 0, 0, 90))
        image.alpha_composite(box)
        draw = ImageDraw.Draw(image)
        for line, size, colour in zip(lines, sizes, colours):
            draw_rows(draw, [line], y + size // 2, size, [colour], 13)
            y += size + 40
    image.save(path)


# ---------------------------------------------------------------- render

def voice_lines(spec, out):
    """Every line voiced: [(scene, line, start, duration, per-character times or None)] and voice.wav."""
    speaker = speaker_id(*spec["voice"])
    gap, scene_gap = spec.get("line_pause", 0.1), spec.get("scene_pause", 0.25)
    done, position = [], 0.0
    with wave.open(str(out / "voice.wav"), "wb") as output:
        output.setparams((1, 2, RATE, 0, "NONE", "not compressed"))

        def silence(seconds):
            nonlocal position
            frames = round(RATE * seconds)
            output.writeframesraw(b"\x00\x00" * frames)
            position += frames / RATE

        for s, scene in enumerate(spec["scenes"]):
            for l, line in enumerate(scene["lines"]):
                text, say = (line["text"], line["say"]) if isinstance(line, dict) else (line, line)
                query = json.loads(request("/audio_query", params={"text": plain(say), "speaker": speaker}, data=b""))
                query.update(speedScale=spec.get("speed", 1.2), prePhonemeLength=0.07, postPhonemeLength=0.12,
                             pauseLengthScale=0.72, outputSamplingRate=RATE, outputStereo=False)
                wav = request("/synthesis", params={"speaker": speaker}, data=json.dumps(query).encode())
                with wave.open(BytesIO(wav)) as segment:
                    duration = segment.getnframes() / RATE
                    output.writeframesraw(segment.readframes(segment.getnframes()))
                try:
                    times = spoken_times(plain(text), query, duration) if text == say else None
                except (AttributeError, KeyError, TypeError, ValueError):
                    times = None
                done.append((s, l, text, position, duration, times))
                position += duration
                silence(gap)
            silence(scene_gap)
    return done, position


def piece_times(text, start, duration, times):
    """(piece, begin, end) of every caption piece of a line, by the real moment of its characters when known."""
    pieces = chunks_of(text)
    flat = plain(text)
    weights = [reading_weight(c) for c in flat]
    total = sum(weights) or 1
    result, cursor = [], 0
    for piece in pieces:
        letters = plain(piece)
        at = flat.index(letters, cursor)
        first, last = at, at + len(letters) - 1
        cursor = last + 1
        if times and len(times) == len(flat):
            begin, end = times[first][0], times[last][1]
        else:
            begin = sum(weights[:first]) / total * duration
            end = sum(weights[:last + 1]) / total * duration
        result.append((piece, start + begin, start + end))
    # each piece stays until the next one comes
    return [(p, b, result[n + 1][1] if n + 1 < len(result) else start + duration + 0.1)
            for n, (p, b, _) in enumerate(result)]


def render(spec, out):
    out.mkdir(parents=True, exist_ok=True)
    work = out / "work"
    work.mkdir(exist_ok=True)
    lines, length = voice_lines(spec, out)
    index = json.loads((out.parent / "find" / "index.json").read_text()) if (out.parent / "find" / "index.json").exists() else {}

    # scene spans on the voice's timeline
    spans_of = {}
    for s, l, text, start, duration, times in lines:
        first = spans_of.get(s, (start, start))[0]
        spans_of[s] = (first, start + duration)
    edges = [spans_of[s][0] for s in range(len(spec["scenes"]))] + [length]
    edges[0] = 0.0

    # the clips, cut to the scenes, each scene's time shared by its clips
    parts, credits = [], []
    for s, scene in enumerate(spec["scenes"]):
        begin, end = edges[s], edges[s + 1]
        share = (end - begin) / len(scene["clips"])
        for c, clip in enumerate(scene["clips"]):
            hit = index.get(str(clip["id"])) or {}
            url = hit.get("url") or rendition(pixabay({"id": clip["id"]})["hits"][0])["url"]
            source = work / f"{clip['id']}.mp4"
            if not source.exists():
                source.write_bytes(get(url, timeout=300))
            credits.append(f"scene {s + 1}: Pixabay {clip['id']} by {hit.get('user', '?')} {hit.get('page', '')}"
                           + (" (AI-generated)" if hit.get("ai") else ""))
            x = clip.get("x", 0.5)
            target = work / f"part_{s:02d}_{c}.mp4"
            vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,"
                  f"crop={W}:{H}:(iw-{W})*{x}:(ih-{H})/2,fps={FPS},setsar=1")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-ss", str(clip.get("start", 0)),
                            "-i", str(source), "-t", f"{share:.3f}", "-an", "-vf", vf, "-c:v", "libx264",
                            "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", str(target)], check=True)
            parts.append(target)
    (work / "list.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"),
                    "-c", "copy", str(work / "clips.mp4")], check=True)

    # the text: the hook title over the first scene, an item's number and name over its first line, captions
    overlays = []
    for s, l, text, start, duration, times in lines:
        scene = spec["scenes"][s]
        if l == 0 and scene.get("title"):
            path = work / f"t_{s}.png"
            title_png(scene["title"], path, scene.get("number"))
            stop = edges[s + 1] if not scene.get("number") else start + duration + 0.25
            overlays.append((path, edges[s], stop))
            continue
        for n, (piece, b, e) in enumerate(piece_times(text, start, duration, times)):
            path = work / f"c_{s}_{l}_{n}.png"
            caption_png(piece, path)
            overlays.append((path, b, e))
    inputs, chain, last = [], [], "0:v"
    for n, (path, b, e) in enumerate(overlays, 1):
        inputs += ["-i", str(path)]
        chain.append(f"[{last}][{n}:v]overlay=0:0:enable='between(t,{b:.3f},{e:.3f})'[v{n}]")
        last = f"v{n}"

    # the sound: the voice, the music under it, the whole brought to about -14 LUFS
    music = spec.get("music")
    audio_in = ["-i", str(out / "voice.wav")]
    m = len(overlays) + 2
    if music:
        audio_in += ["-stream_loop", "-1", "-i", music["file"]]
        chain.append(f"[{m}:a]volume={music.get('volume', 0.2)},atrim=0:{length:.3f},afade=t=in:d=1,"
                     f"afade=t=out:st={max(0, length - 1.5):.3f}:d=1.5[mu]")
        chain.append(f"[{m - 1}:a][mu]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]")
    else:
        chain.append(f"[{m - 1}:a]loudnorm=I=-14:TP=-1.5[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(work / "clips.mp4"), *inputs, *audio_in,
                    "-filter_complex", ";".join(chain), "-map", f"[{last}]", "-map", "[a]", "-t", f"{length:.3f}",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac",
                    "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out / "video.mp4")], check=True)
    (out / "credits.txt").write_text("映像: Pixabay (Pixabay License)\n" + "\n".join(credits)
                                     + (f"\n音楽: {music.get('title', music['file'])}\n" if music else "\n"))
    # a sheet of stills, one a second
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "video.mp4"), "-vf",
                    "fps=1,scale=270:480,tile=6x4", "-frames:v", "1", "-q:v", "3", str(out / "sheet.jpg")], check=True)
    print(f"video {length:.1f}s, {len(parts)} clips, {len(overlays)} text overlays")


if __name__ == "__main__":
    mode, story, folder = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    spec = json.loads(story.read_text())
    {"find": find, "render": render}[mode](spec, folder)
