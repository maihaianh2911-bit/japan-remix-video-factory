"""A trial of a new kind of video: short video clips instead of still pictures, with big captions in the middle of
the screen (the style of the source the owner sent on 26/11/2026). A trial only, kept apart from the engine
(`news/`) until the owner approves it: the engine changes only after that.

    python tools/clip_trial.py find   trials/<name>.json <out>   # searches → sheets of candidates (3 frames each)
    python tools/clip_trial.py render trials/<name>.json <out>   # the voice (VOICEVOX at 127.0.0.1:50021) + the video

The clips come from Pixabay (free licence, no credit required; credited all the same in credits.txt; the key is
the secret PIXABAY_API_KEY), Wikimedia Commons (free licences, author and licence in credits.txt) and Mixkit (free
licence; its free files are 720p, so mostly for a horizontal shot shown smaller). A search is "<words>" (Pixabay),
"commons:<words>" or "mixkit:<words>". A scene may also show a still photograph that moves (owner, 26/11/2026: "K cần
cố ép full video đâu, có thể xem vào hình ảnh 4k rồi cho chuyển động cg đc"): "photo:<words>" searches Wikimedia
Commons for photographs of at least 2500 px (free licences, author and licence credited); a clip whose id starts
with "i" is such a photo, shown with a slow move ("move": in, out, left, right, up, down; "x"/"y": the point kept). AI-generated clips are allowed (owner, 26/11/2026: "K cần bỏ video AI, m đc phép
dùng"); the sheet marks them "AI" so that each can be looked at.
"""
import hashlib
import json
import re
import time
import os
import subprocess
import sys
import urllib.error
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
UA = {"User-Agent": "japan-video-factory/1.0 (trial of short clips; GitHub Actions) python-urllib"}
BROWSER = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
ROUNDED = "fonts/MPLUSRounded1c-ExtraBold.ttf"
FALLBACK = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
WHITE, YELLOW, ORANGE, INK = (255, 255, 255), (255, 225, 53), (255, 140, 26), (20, 20, 20)


def font(size):
    try:
        return ImageFont.truetype(ROUNDED, size)
    except OSError:
        return ImageFont.truetype(FALLBACK, size)


def get(url, timeout=60, headers=None):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers or UA), timeout=timeout) as answer:
                return answer.read()
        except urllib.error.HTTPError as error:
            if error.code not in (429, 503) or attempt == 2:
                raise
            time.sleep(5 * (attempt + 1))


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

def pixabay_hits(words):
    lang = "en" if words.isascii() else "ja"
    hits = pixabay({"q": words, "lang": lang, "per_page": 50, "safesearch": "true"}).get("hits", [])
    found = []
    for hit in hits:
        file = rendition(hit)
        found.append({"key": f"p{hit['id']}", "source": "Pixabay", "w": file["width"], "h": file["height"],
                      "seconds": hit["duration"], "ai": bool(hit.get("isAiGenerated")), "title": hit.get("tags"),
                      "page": hit["pageURL"], "author": hit.get("user"), "licence": "Pixabay License",
                      "url": file["url"], "preview": hit["videos"].get("tiny", {}).get("url") or file["url"],
                      "score": hit.get("downloads", 0) + 20 * hit.get("likes", 0)})
    return found


def commons_hits(words):
    url = ("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6"
           "&gsrlimit=50&gsrsearch=" + urllib.parse.quote(f"filetype:video {words}")
           + "&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiextmetadatafilter=Artist%7CLicenseShortName")
    pages = json.loads(get(url)).get("query", {}).get("pages", {}).values()
    found = []
    for page in pages:
        info = (page.get("imageinfo") or [{}])[0]
        seconds = info.get("duration") or 0
        if not info.get("url") or min(info.get("width", 0), info.get("height", 0)) < 720 or not 3 <= seconds <= 240:
            continue
        meta = info.get("extmetadata") or {}
        artist = re.sub(r"<[^>]+>", "", (meta.get("Artist") or {}).get("value", "")).strip()
        found.append({"key": "c" + hashlib.md5(page["title"].encode()).hexdigest()[:8], "source": "Wikimedia Commons",
                      "w": info["width"], "h": info["height"], "seconds": round(seconds), "ai": False,
                      "title": page["title"][5:], "page": info.get("descriptionurl"), "author": artist[:80],
                      "licence": (meta.get("LicenseShortName") or {}).get("value", "?"), "url": info["url"],
                      "preview": info["url"], "score": 0})
    time.sleep(1)
    return found


def photo_hits(words):
    """Photographs on Wikimedia Commons, at least 2500 px on their long side (a 4K-ish still that can move)."""
    url = ("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6"
           "&gsrlimit=50&gsrsearch=" + urllib.parse.quote(f"filetype:bitmap {words}")
           + "&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=400"
           "&iiextmetadatafilter=Artist%7CLicenseShortName%7CDateTimeOriginal")
    pages = json.loads(get(url)).get("query", {}).get("pages", {}).values()
    found = []
    for page in sorted(pages, key=lambda p: p.get("index", 0)):
        info = (page.get("imageinfo") or [{}])[0]
        if max(info.get("width", 0), info.get("height", 0)) < 2500 or info.get("mime") not in ("image/jpeg", "image/png", "image/tiff"):
            continue
        meta = info.get("extmetadata") or {}
        artist = re.sub(r"<[^>]+>", "", (meta.get("Artist") or {}).get("value", "")).strip()
        thumb = info.get("thumburl") or info["url"]
        large = info["url"] if max(info["width"], info["height"]) <= 5000 or "/400px-" not in thumb \
            else thumb.replace("/400px-", "/4000px-")
        found.append({"key": "i" + hashlib.md5(page["title"].encode()).hexdigest()[:8], "source": "Wikimedia Commons",
                      "w": info["width"], "h": info["height"], "seconds": 0, "ai": False, "photo": True,
                      "title": page["title"][5:], "page": info.get("descriptionurl"), "author": artist[:80],
                      "licence": (meta.get("LicenseShortName") or {}).get("value", "?"), "url": large,
                      "preview": thumb, "score": 0})
    time.sleep(1)
    return found


def mixkit_hits(words):
    body = get(f"https://mixkit.co/free-stock-video/{words.replace(' ', '-')}/", headers=BROWSER).decode("utf-8", "replace")
    found, seen = [], set()
    for slug, number in re.findall(r"/free-stock-video/([a-z0-9-]+)-(\d+)/", body):
        if number in seen:
            continue
        seen.add(number)
        found.append({"key": f"m{number}", "source": "Mixkit", "w": 1280, "h": 720, "seconds": 0, "ai": False,
                      "title": slug.replace("-", " "), "page": f"https://mixkit.co/free-stock-video/{slug}-{number}/",
                      "author": "Mixkit", "licence": "Mixkit License",
                      "url": f"https://assets.mixkit.co/videos/{number}/{number}-720.mp4",
                      "preview": f"https://assets.mixkit.co/videos/{number}/{number}-360.mp4", "score": 0})
    return found


def frames_of(entry, folder):
    """Three small frames of a clip (a sixth, the middle, five sixths in), read straight from its file; a photo's
    small picture alone."""
    if entry.get("photo"):
        path = folder / f"{entry['key']}.jpg"
        try:
            if not path.exists():
                path.write_bytes(get(entry["preview"]))
                time.sleep(0.3)
            picture = Image.open(path).convert("RGB")
            picture.thumbnail((300, 300))
            return [picture]
        except Exception:
            return [Image.new("RGB", (300, 169), (60, 60, 60))]
    pictures = []
    seconds = entry["seconds"] or 10
    for n, share in enumerate((1 / 6, 1 / 2, 5 / 6)):
        path = folder / f"{entry['key']}_{n}.jpg"
        if not path.exists():
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-user_agent", UA["User-Agent"], "-ss",
                            f"{seconds * share:.2f}", "-i", entry["preview"], "-frames:v", "1",
                            "-vf", "scale=300:300:force_original_aspect_ratio=decrease", str(path)],
                           timeout=90, check=False)
        try:
            pictures.append(Image.open(path).convert("RGB"))
        except OSError:
            pictures.append(Image.new("RGB", (300, 169), (60, 60, 60)))
    return pictures


def find(spec, out, keep=9):
    out.mkdir(parents=True, exist_ok=True)
    frames = out / "frames"
    frames.mkdir(exist_ok=True)
    index = json.loads((out / "index.json").read_text()) if (out / "index.json").exists() else {}
    for number, search in enumerate(spec["searches"], 1):
        kind, _, words = search.partition(":") if search.split(":")[0] in ("commons", "mixkit", "photo") \
            else ("pixabay", "", search)
        try:
            hits = {"pixabay": pixabay_hits, "commons": commons_hits, "mixkit": mixkit_hits,
                    "photo": photo_hits}[kind](words)
        except Exception as error:
            print(f"::warning::{search}: {error}")
            hits = []
        # tall first, then sharp, then liked; a clip already shown in an earlier sheet is left out
        hits = [h for h in hits if h["key"] not in index]
        hits.sort(key=lambda h: (-(h["h"] > h["w"]), -min(max(h["w"], h["h"]), 3840), -h["score"]))
        hits = hits[:keep]
        for hit in hits:
            index[hit["key"]] = hit
        tiles = [(frames_of(hit, frames), f"{hit['key']}  {hit['w']}x{hit['h']}  "
                  + ("ảnh" if hit.get("photo") else f"{hit['seconds']}s")
                  + ("  AI" if hit["ai"] else ""), (hit["title"] or "")[:44]) for hit in hits]
        sheet(tiles, f"{number}. {search}  ({len(hits)} mới)", out / f"sheet_{number:02d}.jpg")
    (out / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1))


def sheet(tiles, title, path):
    cell, columns = 300, 9           # three candidates a row, three frames each
    rows = max(1, (len(tiles) + 2) // 3)
    canvas = Image.new("RGB", (columns * cell, 60 + rows * (cell + 70)), (25, 25, 25))
    draw = ImageDraw.Draw(canvas)
    draw.text((12, 10), title, font=font(36), fill=WHITE)
    for n, (pictures, label, words) in enumerate(tiles):
        x0, y = n % 3 * 3 * cell, 60 + n // 3 * (cell + 70)
        for k, picture in enumerate(pictures):
            canvas.paste(picture, (x0 + k * cell + (cell - picture.width) // 2, y + (cell - picture.height) // 2))
        draw.rectangle((x0, y, x0 + 3 * cell - 1, y + cell + 68), outline=(90, 90, 90), width=2)
        draw.text((x0 + 8, y + cell + 4), label, font=font(26), fill=YELLOW if label.endswith("AI") else WHITE)
        draw.text((x0 + 8, y + cell + 36), words, font=font(20), fill=(190, 190, 190))
    canvas.save(path, quality=86)


# ---------------------------------------------------------------- text

def plain(text):
    return text.replace("*", "").replace("|", "")


def chunks_of(line, longest=13):
    """The caption pieces of a line, cut at its commas and stops, a long piece cut again near its middle after a
    particle; '*' marks the keyword spans (shown yellow) and stays in the pieces; '|' is a break chosen by hand
    (neither shown nor spoken)."""
    pieces, current = [], ""
    for char in line:
        if char in "、。！？|":
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
    """The rows of a caption piece: one row when it fits, else cut where a reader would pause (after a particle,
    else where kana turn to kanji), as near the middle as possible, never inside a keyword."""
    letters = plain(text)
    if len(letters) <= per_row:
        return [text]

    def good(i):
        before, after = text[i - 1], text[i]
        if text[:i].count("*") % 2:
            return 9                                   # inside a keyword: never
        if before in "はがをにでのともへ、" or after == "*" or before == "*":
            return 0
        kana = lambda c: "\u3041" <= c <= "\u309f"
        if kana(before) and not kana(after):
            return 1
        return 3
    middle = len(text) / 2
    cut = min(range(2, len(text) - 1), key=lambda i: (good(i), abs(i - middle)) if good(i) < 9 else (9, 0))
    if good(cut) >= 3 or abs(cut - middle) > per_row / 2:
        cut = min(range(2, len(text) - 1), key=lambda i: (good(i) >= 9, abs(i - middle) + 1.5 * good(i)))
    return [part for half in (text[:cut], text[cut:]) for part in rows_of(half, per_row)]


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


def canvas():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def shadowed(image, blur=10, strength=150):
    """A soft dark shadow under the text, so that it reads on snow and sky as well."""
    from PIL import ImageFilter
    alpha = image.getchannel("A").filter(ImageFilter.GaussianBlur(blur))
    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow.putalpha(alpha.point(lambda v: min(255, v * strength // 255)))
    result = canvas()
    result.alpha_composite(shadow, (0, 8))
    result.alpha_composite(image)
    return result


def caption_layers(text):
    image = canvas()
    rows = rows_of(text, 10)
    draw_rows(ImageDraw.Draw(image), rows, 1180, 96, [WHITE] * len(rows), 12)
    return [(shadowed(image), 0.0)]


def title_layers(lines, number=None, top=520):
    """The big title as layers that come in one after the other: (image, delay in seconds)."""
    layers = []
    if number:
        image = canvas()
        draw_rows(ImageDraw.Draw(image), [number], 800, 240, [YELLOW], 15)
        layers.append((shadowed(image), 0.0))
        image = canvas()
        draw_rows(ImageDraw.Draw(image), lines, 1070, 126, [WHITE] * len(lines), 13)
        layers.append((shadowed(image), 0.12))
        return layers
    sizes = [min(150, 900 // max(1, len(plain(line)))) for line in lines]   # every line inside the box
    colours = [WHITE, ORANGE, WHITE, ORANGE]
    y = top                         # where the first line starts: keep the landmark of the picture clear
    total = sum(sizes) + 40 * (len(lines) - 1)
    box = canvas()
    ImageDraw.Draw(box).rounded_rectangle((50, y - 50, W - 50, y + total + 50), 40, fill=(0, 0, 0, 100))
    layers.append((box, 0.0))
    for n, (line, size, colour) in enumerate(zip(lines, sizes, colours)):
        image = canvas()
        draw_rows(ImageDraw.Draw(image), [line], y + size // 2, size, [colour], 13)
        layers.append((shadowed(image), 0.22 * n))
        y += size + 40
    return layers


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


# ---------------------------------------------------------------- the picture: clips and animated text

POP = 0.18          # seconds a text takes to come in: it grows from 82 % with a small overshoot


def pop(progress):
    """0 → 1 with a small overshoot (ease-out-back)."""
    p = min(1.0, max(0.0, progress)) - 1
    return 1 + 2.2 * p ** 3 + 1.2 * p ** 2


class Layer:
    def __init__(self, image, begin, end):
        box = image.getbbox() or (0, 0, 1, 1)
        self.image, self.box = image.crop(box), box
        self.begin, self.end = begin, end

    def draw(self, frame, t):
        if not self.begin <= t < self.end:
            return
        grown = pop((t - self.begin) / POP)
        if grown >= 0.999 and t - self.begin > POP:
            frame.alpha_composite(self.image, self.box[:2])
            return
        scale = 0.82 + 0.18 * grown
        width, height = max(1, round(self.image.width * scale)), max(1, round(self.image.height * scale))
        small = self.image.resize((width, height), Image.BILINEAR)
        alpha = min(1.0, (t - self.begin) / (POP * 0.6))
        if alpha < 1:
            small.putalpha(small.getchannel("A").point(lambda v: int(v * alpha)))
        centre_x, centre_y = (self.box[0] + self.box[2]) / 2, (self.box[1] + self.box[3]) / 2
        frame.alpha_composite(small, (round(centre_x - width / 2), round(centre_y - height / 2)))


def compose(clips, layers, length, target):
    """The clip track with the text drawn over it, frame by frame (the text grows in, as in the source)."""
    count = round(length * FPS)
    reader = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(clips), "-f", "rawvideo", "-pix_fmt", "rgb24",
                               "-frames:v", str(count), "-"], stdout=subprocess.PIPE)
    writer = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                               "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
                               "-pix_fmt", "yuv420p", str(target)], stdin=subprocess.PIPE)
    size, last = W * H * 3, None
    for number in range(count):
        data = reader.stdout.read(size)
        if len(data) < size:
            data = last                      # the clip track a frame short: hold its last frame
        last = data
        t = number / FPS
        active = [layer for layer in layers if layer.begin <= t < layer.end]
        if active:
            frame = Image.frombytes("RGB", (W, H), data).convert("RGBA")
            for layer in active:
                layer.draw(frame, t)
            data = frame.convert("RGB").tobytes()
        writer.stdin.write(data)
    writer.stdin.close()
    reader.stdout.close()
    if writer.wait() or reader.wait() not in (0, -13, 255):
        raise RuntimeError("compose failed")


PART_FORMAT = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p",
               "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv"]


def ease(p):
    """Slow at both ends (a sine), so that a still glides rather than jerks."""
    import math
    return 0.5 - 0.5 * math.cos(math.pi * min(1.0, max(0.0, p)))


def still_part(source, seconds, clip, target):
    """A photograph as a moving shot: a slow zoom or pan over it, drawn frame by frame with sub-pixel steps
    (an ffmpeg zoompan steps by whole pixels and shakes)."""
    from PIL import ImageEnhance
    image = Image.open(source).convert("RGB")
    move, fx, fy = clip.get("move", "in"), clip.get("x", 0.5), clip.get("y", 0.5)
    travel = clip.get("travel", 0.12)                       # how far the move goes: 12 % of the frame
    margin = 1 + travel
    cover = max(W * margin / image.width, H * margin / image.height)
    if cover < 1:                                            # keep only the pixels the frames can use
        image = image.resize((round(image.width * cover), round(image.height * cover)), Image.LANCZOS)
        cover = 1.0
    image = ImageEnhance.Color(image).enhance(1.1)
    full_w, full_h = W / cover, H / cover                    # the view at zoom 1 (with room to move)
    count = max(1, round(seconds * FPS))
    writer = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                               "-r", str(FPS), "-i", "-", *PART_FORMAT, str(target)], stdin=subprocess.PIPE)
    for n in range(count):
        p = ease(n / max(1, count - 1))
        if move in ("in", "out"):
            zoom = 1 + travel * (p if move == "in" else 1 - p)
            view_w, view_h = full_w * margin / zoom, full_h * margin / zoom
            cx, cy = fx * image.width, fy * image.height
        else:
            view_w, view_h = full_w * margin / (1 + travel / 2), full_h * margin / (1 + travel / 2)
            span_x, span_y = image.width - view_w, image.height - view_h
            cx, cy = fx * image.width, fy * image.height
            if move in ("left", "right"):
                start, end = (0.75, 0.25) if move == "left" else (0.25, 0.75)
                cx = view_w / 2 + span_x * (start + (end - start) * p)
            else:
                start, end = (0.75, 0.25) if move == "up" else (0.25, 0.75)
                cy = view_h / 2 + span_y * (start + (end - start) * p)
        left = min(max(cx - view_w / 2, 0), image.width - view_w)
        top = min(max(cy - view_h / 2, 0), image.height - view_h)
        frame = image.resize((W, H), Image.BICUBIC, box=(left, top, left + view_w, top + view_h))
        writer.stdin.write(frame.tobytes())
    writer.stdin.close()
    if writer.wait():
        raise RuntimeError(f"still part {target.name} failed")


def fetch(entry, folder):
    if entry.get("photo"):
        path = folder / (entry["key"] + ".jpg")
        if not path.exists():
            path.write_bytes(get(entry["url"], timeout=300))
        return path
    path = folder / (entry["key"] + (".webm" if entry["url"].endswith(".webm") else ".mp4"))
    if not path.exists():
        path.write_bytes(get(entry["url"], timeout=600))
    return path


def render(spec, out):
    out.mkdir(parents=True, exist_ok=True)
    work = out / "work"
    work.mkdir(exist_ok=True)
    found = out.parent / "find" / "index.json"
    index = json.loads(found.read_text()) if found.exists() else {}
    lines, length = voice_lines(spec, out)
    length += spec.get("tail", 0.6)

    # scene spans on the voice's timeline; a scene's clips change where one of its lines starts
    starts = {}
    for s, l, text, start, duration, times in lines:
        starts.setdefault(s, []).append(start)
    edges = [0.0] + [starts[s][0] for s in range(1, len(spec["scenes"]))] + [length]
    parts, credits = [], []
    for s, scene in enumerate(spec["scenes"]):
        begin, end = edges[s], edges[s + 1]
        clips = scene["clips"]
        cuts = [begin]
        for c in range(1, len(clips)):
            wanted = begin + (end - begin) * c / len(clips)
            near = min(starts[s][1:] or [wanted], key=lambda at: abs(at - wanted))
            cuts.append(near if abs(near - wanted) < 1.5 and near > cuts[-1] + 1.0 else wanted)
        cuts.append(end)
        for c, clip in enumerate(clips):
            key = clip["id"] if isinstance(clip["id"], str) else f"p{clip['id']}"
            entry = index.get(key)
            if entry is None and key.startswith("p"):
                hit = pixabay({"id": key[1:]})["hits"][0]
                entry = {"key": key, "url": rendition(hit)["url"], "source": "Pixabay", "author": hit.get("user"),
                         "page": hit["pageURL"], "licence": "Pixabay License", "ai": bool(hit.get("isAiGenerated"))}
            source = fetch(entry, work)
            credits.append(f"{scene.get('label', s + 1)}: {entry['source']} — {entry.get('title') or ''} — "
                           f"{entry.get('author') or '?'} — {entry.get('licence')} — {entry.get('page')}"
                           + ("  (AI-generated)" if entry.get("ai") else ""))
            seconds = cuts[c + 1] - cuts[c]
            if entry.get("photo"):
                target = work / f"part_{s:02d}_{c}.mp4"
                still_part(source, seconds, clip, target)
                parts.append(target)
                continue
            x, y, speed = clip.get("x", 0.5), clip.get("y", 0.5), clip.get("speed", 1.0)
            zoom = clip.get("zoom", 1.0)
            target = work / f"part_{s:02d}_{c}.mp4"
            vf = (f"setpts=PTS/{speed},"
                  f"scale={round(W * zoom)}:{round(H * zoom)}:force_original_aspect_ratio=increase:flags=lanczos,"
                  f"crop={W}:{H}:(iw-{W})*{x}:(ih-{H})*{y},fps={FPS},setsar=1,setpts=PTS-STARTPTS,"
                  "eq=saturation=1.12:contrast=1.04,"
                  # every part the same colour description (a change at a join made ffmpeg drop the text once)
                  "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,"
                  "setparams=range=tv:color_primaries=bt709:color_trc=bt709:colorspace=bt709")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-ss", str(clip.get("start", 0)),
                            "-i", str(source), "-t", f"{seconds:.3f}", "-an", "-vf", vf, *PART_FORMAT, str(target)],
                           check=True)
            parts.append(target)
    (work / "list.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"),
                    "-c", "copy", str(work / "clips.mp4")], check=True)

    # the text: the hook title over the first scene, an item's number and name over its first line, captions
    layers = []
    for s, l, text, start, duration, times in lines:
        scene = spec["scenes"][s]
        if l == 0 and scene.get("title"):
            stop = edges[s + 1] if not scene.get("number") else start + duration + 0.3
            begin = edges[s]
            for image, delay in title_layers(scene["title"], scene.get("number"), scene.get("title_top", 520)):
                layers.append(Layer(image, begin + delay, stop))
            continue
        for piece, b, e in piece_times(text, start, duration, times):
            for image, delay in caption_layers(piece):
                layers.append(Layer(image, b + delay, e))
    for layer in layers:
        print(f"text {layer.begin:6.2f}–{layer.end:6.2f}")
    compose(work / "clips.mp4", layers, length, work / "picture.mp4")

    # the sound: the voice, the music under it, the whole brought to about -14 LUFS
    music = spec.get("music")
    command = ["ffmpeg", "-v", "error", "-y", "-i", str(work / "picture.mp4"), "-i", str(out / "voice.wav")]
    if music:
        command += ["-stream_loop", "-1", "-i", music["file"], "-filter_complex",
                    f"[1:a]apad,atrim=0:{length:.3f}[v];"
                    f"[2:a]volume={music.get('volume', 0.2)},atrim=0:{length:.3f},afade=t=in:d=1,"
                    f"afade=t=out:st={max(0, length - 1.5):.3f}:d=1.5[mu];"
                    "[v][mu]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]"]
    else:
        command += ["-filter_complex", f"[1:a]apad,atrim=0:{length:.3f},loudnorm=I=-14:TP=-1.5[a]"]
    command += ["-map", "0:v", "-map", "[a]", "-t", f"{length:.3f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                "-ar", "48000", "-movflags", "+faststart", str(out / "video.mp4")]
    subprocess.run(command, check=True)
    (out / "credits.txt").write_text("映像:\n" + "\n".join(credits)
                                     + (f"\n音楽: {music.get('title', music['file'])}\n" if music else "\n"))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "video.mp4"), "-vf",
                    "fps=2,scale=180:320,tile=10x5", "-frames:v", "1", "-q:v", "3", str(out / "sheet.jpg")], check=True)
    print(f"video {length:.1f}s, {len(parts)} clips, {len(layers)} text layers")


if __name__ == "__main__":
    mode, story, folder = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    spec = json.loads(story.read_text())
    {"find": find, "render": render}[mode](spec, folder)
