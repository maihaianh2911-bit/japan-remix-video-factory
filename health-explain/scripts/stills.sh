#!/usr/bin/env bash
# Chụp vài frame kiểm tra: bash scripts/stills.sh [giây ...] → out/stills/
set -e
cd "$(dirname "$0")/.."
mkdir -p out/stills
FLAGS=${REMOTION_FLAGS:-"--browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing"}
COMP=${COMP:-hiyagohan}
SECS=${@:-"0.2 3 7 11 14 15.5 18 21 24 27 31 33 36 38.5 41 46.5 51 56 61 65"}
for sec in $SECS; do
  f=$(python3 -c "print(int(round($sec*30)))")
  npx remotion still src/index.ts "$COMP" "out/stills/f_$(printf '%05.1f' $sec).png" --frame=$f $FLAGS --log=error >/dev/null
done
python3 - <<'PY'
from PIL import Image, ImageDraw
import glob
fs=sorted(glob.glob('out/stills/f_*.png'))
cols=6; w,h=270,480
rows=(len(fs)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h),'black')
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((w,h))
    ImageDraw.Draw(im).text((6,6),f.split('_')[-1][:-4],fill='yellow')
    sheet.paste(im,((i%cols)*w,(i//cols)*h))
sheet.save('out/stills/sheet.jpg',quality=85)
print(len(fs),'frames → out/stills/sheet.jpg')
PY
