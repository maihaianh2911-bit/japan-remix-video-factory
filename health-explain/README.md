# health-explain — video giải thích sức khỏe (Remotion), bản thử 28/11/2026

Chủ kênh gửi một video TikTok tiếng Việt của kênh Y Học Tâm Trí (2 phút 40 giây, cơm nguội để tủ lạnh thành tinh bột
kháng; nền mây đen, mỗi đoạn một tranh khoa học trong khung trắng, chữ to chạy theo giọng, một "bác sĩ" ở góc) và
hỏi làm được không. Tranh của video đó là **ảnh AI kênh đó tự tạo** (chữ tiếng Việt vẽ trong tranh, chữ sai
"Stater"), không tìm được. Chủ kênh chọn **cách 1: ảnh thật tìm bằng máy tìm ảnh của repo + hình vẽ bằng code**,
chủ đề cơm nguội, kịch bản theo bản Việt đã thu gọn. Chưa có kênh, chưa có issue.

Bố cục là của mình: nền xanh đêm có hạt bay, tên loạt 「からだの科学」 + tên video + thanh tiến độ ở trên, thẻ trắng
(tiêu đề cảnh, ảnh hoặc hình vẽ, lời giải thích 1–2 dòng, nguồn), kính lúp (ảnh hiển vi trong vòng tròn nối với một
điểm trên ảnh), phụ đề chạy theo giọng (từ khóa vàng). **Không có "bác sĩ"**: mình không phải bác sĩ.

## Kịch bản (bài học 28/11/2026)

- **Mọi lần sửa kịch bản (cả khi chỉ sửa hook theo lời chủ kênh) đều gửi lại cả kịch bản: tiếng Nhật liền một đoạn,
  rồi nghĩa tiếng Việt liền một đoạn, và chờ "ok làm đi" rồi mới làm giọng, dựng hình.** Lần này Claude sửa hook rồi
  dựng luôn, chủ kênh: "m k thèm dịch kịch bản cho tao đọc, m tự sửa tự làm luôn à ? M phá luật à".
- **Hook theo video gốc**: mở bằng điều ai cũng nghĩ ("cơm nguội kém dinh dưỡng, lạnh bụng") rồi lật lại bằng một
  "bí mật". Hook kiểu "nói thẳng kết luận ngay câu đầu" (luật hook của kênh hoàng gia) bị chê: "Có ai viết hook ngu
  như thế ko". Hook gốc dài thì rút gọn ("Đúng v của nó quá dài r, giảm đi").
- Sửa cho đúng nghiên cứu, nói rõ với chủ kênh: "gấp 10 lần" → khoảng 2,5 lần (Sonia 2015), bỏ "đốt mỡ hiệu quả";
  thêm cảnh báo ngộ độc khi để cơm ở nhiệt độ phòng (農林水産省). Caption có ※ về cỡ nghiên cứu và người đang điều trị.

## Các bước

```bash
# 1. Giọng 青山龍星 (VOICEVOX 0.26.1 ở 127.0.0.1:50021; bản Linux trên trang release của VOICEVOX/voicevox_engine,
#    file voicevox_engine-linux-cpu-x64-0.26.1.7z.001, giải nén bằng py7zr, chạy ./run --host 127.0.0.1 --port 50021)
python -m doodle.voice health-explain/stories/<tên>
cp health-explain/stories/<tên>/out/timing.json health-explain/src/videos/<tên>.timing.json

# 2. Ảnh: story chỉ để tìm ảnh stories/k10-<ngày>-thu-<tên>.json (stage find, trial) → chạy workflow Japan Remix Video
#    (Run workflow, mode story, tên story; từ nhánh của phiên cũng được) → renders/<story>/find/ → xem sheet_*.jpg →
#    chép ảnh chọn vào public/images/<tên>/ và ghi credits.md

# 3. Hình
cd health-explain && npm ci
COMP=<tên> bash scripts/stills.sh            # out/stills/sheet.jpg — xem trước khi render
npx remotion render src/index.ts <tên> stories/<tên>/out/picture.mp4 --muted --concurrency=2 \
  --browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing

# 4. Tiếng (giọng + tiếng pop/whoosh/thud + nhạc ~17 dB dưới giọng) và phụ đề
cd .. && python -m doodle.sound health-explain/stories/<tên>   # → out/video.mp4, subtitles.srt, cover.jpg
```

- Mỗi video: `stories/<tên>/story.json` (lời đọc, nhạc, tiếng động), `caption.txt`, `music/`; ảnh ở
  `public/images/<tên>/`; cảnh ở `src/videos/<Tên>.tsx` (dùng `ExplainFrame` của `src/frame.tsx` và đồ của
  `src/kit.tsx`), đăng ký trong `src/Root.tsx`.
- Cảnh bắt đầu ở chữ nào của giọng đọc: `at(câu, "chữ")`. Cảnh đầu (hook) có mọi chữ ngay từ khung hình đầu.
- Chữ quan trọng không ra ngoài x 60–930, y < 1540 (nút và chữ của TikTok).

| Tên | Tiêu đề | Độ dài |
| --- | --- | --- |
| `hiyagohan` | 前の晩の冷やご飯 / 冷やご飯の秘密 (tinh bột kháng) | 66.3 s |
