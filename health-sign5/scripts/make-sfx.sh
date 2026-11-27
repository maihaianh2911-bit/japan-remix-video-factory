#!/usr/bin/env bash
# Tổng hợp hai hiệu ứng âm thanh bằng ffmpeg (không cần file ngoài):
#   public/sfx/pop.wav     tiếng "pop" khi chữ bật vào
#   public/sfx/whoosh.wav  tiếng "whoosh" khi chuyển cảnh
# Muốn dùng âm thanh riêng: chép đè file cùng tên vào public/sfx/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/sfx

# pop: sóng sin rơi nhanh từ ~900 Hz xuống 300 Hz, tắt dần trong 0.16 s
ffmpeg -y -loglevel error -f lavfi -i \
  "aevalsrc='0.85*min(1,t/0.003)*exp(-26*t)*sin(2*PI*(300*t+15*(1-exp(-40*t))))':s=48000:d=0.18" \
  -af "afade=t=out:st=0.14:d=0.04" -ac 2 -c:a pcm_s16le public/sfx/pop.wav

# whoosh: tiếng ồn hồng lọc dải, to dần rồi nhỏ dần trong 0.42 s
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=color=pink:sample_rate=48000:duration=0.42:amplitude=0.9:seed=7" \
  -af "highpass=f=700,lowpass=f=5200,volume=eval=frame:volume='2.4*pow(sin(PI*t/0.42),2)',afade=t=out:st=0.36:d=0.06" \
  -ac 2 -c:a pcm_s16le public/sfx/whoosh.wav

ls -l public/sfx
