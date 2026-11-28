# tin-tuc — kênh tin tức (bản thử 28/11/2026, Remotion)

Chủ kênh gửi một video tin tức tiếng Việt (khung giấy kem, khung vuông viền đen, số to chạy, cột VS đỏ đen,
cửa sổ "TIN NÓNG", tem đỏ, nhân vật que, phụ đề tô đỏ) và hỏi làm cho Nhật được không; rồi: "chỉ cần là dạng tin
tức", kết hợp **ảnh thật** tìm bằng máy tìm ảnh của repo, **kênh mới, tên "tin tức"**, "làm thử đi".
Bố cục là của mình: tên trên màn hình 「数字で読むニュース」, phóng viên que đội mũ nồi đỏ có thẻ PRESS, mẩu báo
cắt có băng dính cho ảnh thật (`src/kit.tsx`). Chưa có file kênh, chưa có issue.

Video đầu: 「訪日客、中国半減でも過去最多」 (68 s, số liệu JNTO công bố 18/11/2026).

```bash
python -m doodle.voice tin-tuc/story          # giọng 青山龍星 (VOICEVOX ở 127.0.0.1:50021)
cp tin-tuc/story/out/timing.json tin-tuc/src/timing.json
# ảnh: story tìm ảnh stories/k10-2026-11-28-thu-hounichi.json (stage find, trial) → renders/<story>/find/
cd tin-tuc && npm install && bash scripts/stills.sh
npx remotion render src/index.ts News story/out/picture.mp4 --muted --concurrency=2 \
  --browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing
cd .. && python -m doodle.sound tin-tuc/story   # → story/out/video.mp4, subtitles.srt
```

Cảnh nào bắt đầu ở chữ nào của giọng đọc: `src/News.tsx` (`at(câu, "chữ")`). Từ khóa tô đỏ trong phụ đề: `HOT`.
