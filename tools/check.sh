#!/usr/bin/env bash
# The offline check of the pipeline: no network, no voice engine, no renders branch. A push of code to main runs it on
# GitHub (remix-video.yml, "check"); run it here before pushing a change of news/, tools/, channels/ or tests/.
#
#   bash tools/check.sh <out folder> [--fx]
#
# It compiles the code, checks the channel files, every story and every posting caption, runs the picture search and
# channel tests on made-up answers, draws the stills of every sample story (stories/mau-*.json) from the pictures of
# tests/fixtures/pictures into <out>/mau-<channel>/sheet.jpg, encodes 3 seconds of video in the three frames and
# every move and cut of the catalogue (<out>/moves.jpg, <out>/cuts.jpg).
# --fx also runs tools/fx_test.py (<out>/fx/sheet.jpg): it needs numpy, opencv-python-headless and onnxruntime, the
# depth model and the display typeface (CLAUDE.md, "fx"). GitHub always runs it.
set -euo pipefail
OUT="${1:?usage: bash tools/check.sh <out folder> [--fx]}"
FX="${2:-}"
cd "$(dirname "${BASH_SOURCE[0]}")/.."
PICTURES=tests/fixtures/pictures
SAMPLE=stories/mau-k11.json   # the sample the encode, edits and effects tests use
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
shopt -s nullglob
mkdir -p "$OUT"

step() { echo; echo "== $*"; }

step "compile"
python -m compileall -q news tools
step "channels"
python -m news.channels
step "stories and captions"
for story in stories/*.json; do python -m news.custom "$story"; done
for caption in captions/*.txt; do python -m news.captions "$caption"; done
step "picture search (made-up answers)"
python tools/find_test.py
step "channel layer"
python tools/channel_test.py
step "stills of the sample stories"
[[ -f "$PICTURES/index.json" ]] || { echo "::error::$PICTURES/index.json is missing: the sample stills need its pictures"; exit 1; }
samples=(stories/mau-*.json)
(( ${#samples[@]} )) || { echo "::error::no sample story (stories/mau-<channel>.json)"; exit 1; }
for story in "${samples[@]}"; do
  name=$(basename "$story" .json)
  python -m news.custom "$story" "$PICTURES"
  python -m news --story "$story" --pictures "$PICTURES" --stills "$OUT/$name"
done
step "3 seconds of video in the three frames"
python tools/encode_test.py "$SAMPLE" "$PICTURES" "$WORK/encode-test"
step "every move and cut of the catalogue"
python tools/edits_test.py "$SAMPLE" "$PICTURES" "$WORK/edits-test" 1
cp "$WORK/edits-test/moves.jpg" "$WORK/edits-test/cuts.jpg" "$OUT/"
if [[ "$FX" == --fx ]]; then
  step "picture effects (fx)"
  python tools/fx_test.py "$SAMPLE" "$PICTURES" "$WORK/fx-test"
  mkdir -p "$OUT/fx" && cp "$WORK/fx-test/fx/"*.jpg "$OUT/fx/"
else
  echo; echo "(picture effects not checked: add --fx when their libraries, model and typeface are installed)"
fi
echo; echo "offline check OK: $OUT"
