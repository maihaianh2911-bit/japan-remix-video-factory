# tin-tuc — kênh tin tức (bản thử 28/11/2026, Remotion)

Chủ kênh gửi một video tin tức tiếng Việt (khung giấy kem, khung vuông viền đen, số to chạy, cột VS đỏ đen,
cửa sổ "TIN NÓNG", tem đỏ, nhân vật que, phụ đề tô đỏ) và hỏi làm cho Nhật được không; rồi: "chỉ cần là dạng tin
tức", kết hợp **ảnh thật** tìm bằng máy tìm ảnh của repo, **kênh mới, tên "tin tức"**, "làm thử đi".
Bố cục là của mình: tên trên màn hình 「数字で読むニュース」, phóng viên que đội mũ nồi đỏ có thẻ PRESS, mẩu báo
cắt có băng dính cho ảnh thật (`src/kit.tsx`). Chưa có file kênh, chưa có issue.

**Chỉ làm tin mới** (chủ kênh, 28/11/2026: "Cập nhật dữ liệu mới nhất đến hôm nay đi, có thể tìm kiếm trên mạng,
đừng làm tin cũ"): tìm tin của mấy ngày gần nhất trên mạng trước khi viết. **Mỗi ngày 2 tin, không chính trị, không nghệ sĩ** (chủ kênh, 28/11/2026: "bỏ dạng tin tức nghệ sĩ", rồi "giảm
xuống 2 tin, bỏ tin chính trị"): tin kinh tế và đời sống có con số (thuế, lương, giá cả, du lịch, giáo dục…).
Cách chọn: tin vừa đang được tìm nhiều trên Google Trends Nhật (https://trends.google.co.jp/trending?geo=JP), vừa có
con số rõ, vừa đụng tới đời sống; tin chưa xác nhận thì bỏ. Video `seki` (chính trị) đã làm trước khi bỏ mảng này.
Đầu video là đầu bản tin (dải đen, NEWS, ngày, tiêu đề lớn đứng suốt video); phụ đề kiểu テロップ.

| Tên (`stories/<tên>`) | Tiêu đề | Độ dài | Số liệu |
| --- | --- | --- | --- |
| `hounichi` | 訪日客、中国半減でも過去最多 | 68 s | JNTO, công bố 18/11/2026 |
| `ijime` | いじめ79万件で過去最多、性的いじめ初調査8158件 | 70 s | 文部科学省, công bố 26/11/2026 |
| `seki` | 関文科相の問責決議案、4票差で否決 (政治) | 70 s | 参院本会議 27/11/2026 (共同, ロイター) |

Mỗi video: `stories/<tên>/story.json` (lời đọc, nhạc, tiếng động), `caption.txt`, `music/`; ảnh trong
`public/images/<tên>/`; cảnh trong `src/videos/<Tên>.tsx` (dùng `NewsFrame` của `src/frame.tsx` và đồ của
`src/kit.tsx`), đăng ký trong `src/Root.tsx` (id = tên). Nguồn ảnh: `credits.md`.

```bash
python -m doodle.voice tin-tuc/stories/<tên>     # giọng 青山龍星 (VOICEVOX ở 127.0.0.1:50021)
cp tin-tuc/stories/<tên>/out/timing.json tin-tuc/src/videos/<tên>.timing.json
# ảnh: story tìm ảnh stories/k10-<ngày>-thu-<tên>.json (stage find, trial) → renders/<story>/find/
cd tin-tuc && npm install && COMP=<tên> bash scripts/stills.sh
npx remotion render src/index.ts <tên> stories/<tên>/out/picture.mp4 --muted --concurrency=2 \
  --browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing
cd .. && python -m doodle.sound tin-tuc/stories/<tên>   # → out/video.mp4, subtitles.srt, cover.jpg
```

Cảnh nào bắt đầu ở chữ nào của giọng đọc: `at(câu, "chữ")` trong `src/videos/<Tên>.tsx`. Từ khóa tô đỏ trong phụ
đề: `HOT`. Tin buồn về trẻ em (`ijime`): không dùng ảnh mặt trẻ em, không kể chi tiết tự tử, cuối video là số
điện thoại tư vấn.
