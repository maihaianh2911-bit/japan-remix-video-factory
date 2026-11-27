# car-tips — video dọc mẹo xe 「〜3選」 (Remotion), bản thử 27/11/2026

Chủ kênh gửi một video YouTube ngang của kênh mẹo xe Nhật (xếp hạng 「第N位」, nền bảng xanh, ảnh thật ở giữa,
chữ lớn viền đen tô đỏ, phụ đề dưới, nhân vật que cầm thước) và hỏi có dựng được không, rồi chốt: **dọc 9:16,
khoảng 65 giây**, ảnh thật tìm được + hình vẽ bằng code, ảnh AI được dùng (ảnh AI tìm được trên mạng, hoặc chủ kênh
tự tạo theo prompt Claude viết). Đây là **bản thử**: chưa có kênh, chưa có issue, không chạy qua workflow.

Video đầu: 「雪の日にやりがちな、危ない行動3選」 (お湯 → サイドブレーキ → マフラー), số liệu theo JAF.
Bố cục là của mình (không chép logo, nhân vật, khung của kênh mẫu): nhân vật que đội mũ bảo hộ cam, thẻ xếp hạng
tia cam, đồng hồ đo CO, vết nứt kính, lớp băng, ổ khóa đóng băng, dấu ✗/◯ đều vẽ bằng code (`src/kit.tsx`).

## Các bước

```bash
# 1. Giọng (VOICEVOX 0.26.1 chạy ở 127.0.0.1:50021, giọng 青山龍星 như mọi video của repo)
python -m doodle.voice car-tips/story           # → story/out/voice.wav, timing.json
#    (bản này chèn thêm 0.9 s im lặng trước mỗi câu 第N位 cho thẻ xếp hạng, 1.4 s ở cuối)
cp car-tips/story/out/timing.json car-tips/src/timing.json

# 2. Ảnh: story chỉ để tìm ảnh stories/k10-2026-11-27-thu-yuki-ng3.json (stage find, trial) → đẩy lên main →
#    lấy renders/<story>/find/, xem sheet_*.jpg, chép ảnh chọn vào car-tips/public/images/<tên>.jpg (credits.md)

# 3. Hình
cd car-tips && npm install
bash scripts/stills.sh                           # out/stills/sheet.jpg — xem trước khi render
npx remotion render src/index.ts CarTips story/out/picture.mp4 --muted --concurrency=2 \
  --browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing

# 4. Tiếng (giọng + tiếng pop/whoosh + nhạc ~17 dB dưới giọng) và phụ đề .srt
cd .. && python -m doodle.sound car-tips/story   # → story/out/video.mp4, subtitles.srt, cover.jpg
```

- Kịch bản và từng cảnh: `src/CarTips.tsx` (mỗi cảnh bắt đầu ở một chữ của giọng đọc: `at(câu, "chữ")`).
- Bộ khung: `src/kit.tsx`. Không đặt chữ quan trọng ở x > 940 hay y > 1560 (nút và chữ của TikTok).
- Nhạc: The Entertainer (Scott Joplin), Wikimedia Commons, public domain (`story/music/`).
