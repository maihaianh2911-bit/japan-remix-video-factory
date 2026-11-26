"""Cut a mascot pose off its green screen: transparent background, the green fringe taken off the edges, cropped
to the figure, 1000 px high, saved as WebP for the stage.

    python anim/key.py <picture on green> anim/char/samurai-<pose>.webp [<picture> <out> ...]

Needs Pillow and numpy. The figure itself must have no pure green in it.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

HEIGHT = 1000


def key(source, destination):
    pixels = np.asarray(Image.open(source).convert("RGB")).astype(np.float32)
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    greener = green - np.maximum(red, blue)                      # how much greener than anything else
    alpha = 1.0 - np.clip((greener - 40.0) / 80.0, 0.0, 1.0)
    green = np.minimum(green, np.maximum(red, blue) + 12)        # no pixel stays greener than its red and blue
    image = Image.fromarray(np.dstack([red, green, blue, alpha * 255.0]).clip(0, 255).astype(np.uint8), "RGBA")
    edge = image.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    image.putalpha(Image.fromarray(np.minimum(np.asarray(edge), np.asarray(image.getchannel("A")))))
    image = image.crop(image.getchannel("A").point(lambda value: 255 if value > 8 else 0).getbbox())
    image = image.resize((round(image.width * HEIGHT / image.height), HEIGHT), Image.LANCZOS)
    image.save(destination, quality=93, method=6)
    return image.size


if __name__ == "__main__":
    if len(sys.argv) < 3 or len(sys.argv) % 2 == 0:
        raise SystemExit(__doc__)
    for source, destination in zip(sys.argv[1::2], sys.argv[2::2]):
        print(destination, *key(source, destination))
