"""The satellite picture under a map: the tiles of an area are fetched from 国土地理院 (GSI, 全国最新写真 seamlessphoto:
a world satellite mosaic up to zoom 8, Landsat up to 13, aerial photographs above) and joined into one picture.

    python anim/tiles.py <out folder> <name>:<zoom>:<west>,<south>,<east>,<north>[:<shrink>] [...]

Writes <out>/<name>.jpg and <out>/tiles.json: for every picture its zoom and the longitude and latitude of its edges
(Web Mercator, the projection of the stage's map). <shrink> 2 halves the joined picture (a wide area at the
look of a finer zoom). Tiles already fetched are kept in <out>/cache.
Credit on every video that shows them: 出典: 国土地理院 (and for the wide views: Landsat8画像 GSI, TSIC, GEO Grid/AIST;
USGS; 海底地形 GEBCO), https://maps.gsi.go.jp/development/ichiran.html
"""
import io
import json
import math
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

URL = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
SIZE = 256


def tile_xy(lon, lat, zoom):
    n = 2 ** zoom
    x = (lon + 180.0) / 360.0 * n
    y = (1.0 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2.0 * n
    return x, y


def lonlat(x, y, zoom):
    n = 2 ** zoom
    return x / n * 360.0 - 180.0, math.degrees(math.atan(math.sinh(math.pi * (1.0 - 2.0 * y / n))))


def fetch(zoom, x, y, cache):
    path = cache / f"{zoom}-{x}-{y}.jpg"
    if path.exists() and path.stat().st_size > 0:
        return path.read_bytes()
    for attempt in range(4):
        try:
            with urlopen(Request(URL.format(z=zoom, x=x, y=y), headers={"User-Agent": "map-video-maker"}), timeout=30) as response:
                data = response.read()
            path.write_bytes(data)
            return data
        except Exception as error:  # a missing tile (open sea at high zoom) or a slow answer
            if "404" in str(error):
                return None
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"tile {zoom}/{x}/{y} not fetched")


def area(out, name, zoom, west, south, east, north, shrink=1):
    cache = out / "cache"
    cache.mkdir(parents=True, exist_ok=True)
    x0, y0 = map(math.floor, tile_xy(west, north, zoom))
    x1, y1 = map(math.floor, tile_xy(east, south, zoom))
    cells = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)]
    with ThreadPoolExecutor(6) as pool:
        tiles = list(pool.map(lambda cell: fetch(zoom, *cell, cache), cells))
    picture = Image.new("RGB", ((x1 - x0 + 1) * SIZE, (y1 - y0 + 1) * SIZE), (18, 44, 84))
    missing = 0
    for (x, y), data in zip(cells, tiles):
        if data is None:
            missing += 1
            continue
        picture.paste(Image.open(io.BytesIO(data)).convert("RGB"), ((x - x0) * SIZE, (y - y0) * SIZE))
    if shrink > 1:
        picture = picture.resize((picture.width // shrink, picture.height // shrink), Image.LANCZOS)
    picture.save(out / f"{name}.jpg", quality=90)
    left, top = lonlat(x0, y0, zoom)
    right, bottom = lonlat(x1 + 1, y1 + 1, zoom)
    print(f"{name}: zoom {zoom}, {len(cells)} tiles ({missing} empty), {picture.width}×{picture.height}")
    return {"name": name, "file": f"{name}.jpg", "zoom": zoom, "west": left, "north": top, "east": right, "south": bottom,
            "width": picture.width, "height": picture.height}


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    folder = Path(sys.argv[1])
    folder.mkdir(parents=True, exist_ok=True)
    areas = []
    for spec in sys.argv[2:]:
        name, zoom, box, *shrink = spec.split(":")
        areas.append(area(folder, name, int(zoom), *map(float, box.split(",")), shrink=int(shrink[0]) if shrink else 1))
    (folder / "tiles.json").write_text(json.dumps(areas, indent=1), encoding="utf-8")
