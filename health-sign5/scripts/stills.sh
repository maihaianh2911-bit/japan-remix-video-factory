#!/usr/bin/env bash
# Chụp thử vài frame trước khi render cả video.
#   bash scripts/stills.sh              → frame 85 190 330 560
#   bash scripts/stills.sh 100 420      → frame tự chọn
#   SAFE=1 bash scripts/stills.sh       → tô đỏ vùng cấm đặt chữ của TikTok
# Thêm tham số cho Remotion qua biến REMOTION_FLAGS (vd --browser-executable=...).
set -euo pipefail
cd "$(dirname "$0")/.."
FRAMES=("$@"); [ ${#FRAMES[@]} -eq 0 ] && FRAMES=(85 190 330 560)
SUFFIX=""; PROPS='{}'
if [ "${SAFE:-0}" = "1" ]; then SUFFIX="-safe"; PROPS='{"showSafeArea":true}'; fi
mkdir -p out/stills
for n in "${FRAMES[@]}"; do
  npx remotion still Intro "out/stills/f${n}${SUFFIX}.png" --frame="$n" --props="$PROPS" ${REMOTION_FLAGS:-}
done
