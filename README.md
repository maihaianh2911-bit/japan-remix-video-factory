# Japan Remix Video Factory

Máy làm video dọc tiếng Nhật (1080 × 1920, dài hơn 61 giây một chút) cho 4 kênh. Cả 4 kênh làm cùng một cách: mày gửi video
của kênh khác, Claude kể lại câu chuyện đó bằng lời của mình bằng tiếng Nhật (giữ đúng sự thật, không bịa, không chép
nguyên văn), tìm ảnh thật, máy đọc bằng giọng VOICEVOX và dựng video, Claude kiểm tra lại từng cảnh.

Video được edit giống hệt kênh Tin Nhật: ảnh lớn kiểu trang báo cũ, câu mở đầu in to trên ảnh đầu, ảnh chuyển động
có chiều sâu, chữ hiện theo giọng đọc, nhạc nền nhẹ, mỗi cảnh 2 ảnh, Claude duyệt từng ảnh trước khi dựng.

## 4 kênh

| Kênh | Mẫu phiếu | Nội dung | Kênh tham khảo |
| --- | --- | --- | --- |
| 8 | 🎤 Kênh 8 · 3 nghệ sĩ | 3 nghệ sĩ có chung một điểm (芸能人3人) | 芸能トピ速, 芸能バナシのツボ |
| 9 | 🔥 Kênh 9 · Chuyện ồn ào trên mạng | một vụ 炎上 của người có tiếng, cửa hàng, sự kiện | メシアの告発 |
| 10 | 👑 Kênh 10 · Hoàng gia thế giới | hoàng gia Anh, hoàng tộc Trung Quốc ngày xưa | 皇室の記憶 |
| 11 | 📜 Kênh 11 · Lịch sử “vì sao…?” | một câu hỏi "vì sao" của lịch sử và câu trả lời | ヒューマン伝 |

Mỗi kênh có luật riêng để tránh bị kiện và bị YouTube phạt: chỉ kể chuyện báo chí đã đưa tin, không chế giễu ai;
kênh 9 không nêu tên, không lộ mặt người thường; kênh 10 không dùng tin đồn báo lá cải; kênh 11 chỉ theo sử đã được
công nhận, đề tài nhạy cảm kể trung lập. Claude theo các luật này khi viết lại.

## Làm một video

1. Vào **Issues → New issue**, chọn mẫu của kênh (Kênh 8, 9, 10 hoặc 11).
2. Dán link video gốc, hoặc kéo thả file video vào ô "Video gốc". Có lời của video thì dán vào ô thứ hai. Bấm
   **Create**. Hoặc gửi video vào một phiên chat Claude có kết nối repo này và nói kênh nào: Claude tự mở phiếu.
3. Không cần làm gì thêm. Claude viết lại kịch bản và gửi trong phiếu thành một đoạn liền (tiếng Nhật, rồi nghĩa
   tiếng Việt), máy tìm ảnh, Claude chọn ảnh, chọn nhạc và duyệt lại từng ảnh, máy tạo giọng và dựng video, Claude
   kiểm tra từng cảnh. Mỗi bước xong đều báo trong phiếu.
4. Muốn sửa thì viết bình luận trong phiếu, ví dụ "cảnh 3 đổi ảnh khác", "cảnh 5 đổi sang kiểu pull-back".

Video thử (ví dụ bản 20 giây để duyệt giao diện): ghi "thử" hoặc "mẫu" trong tiêu đề hoặc ghi chú.

## Video ở đâu

- Bình luận cuối của phiếu có link video, caption để đăng kèm, phụ đề và nguồn ảnh (dán vào phần mô tả video).
- Mọi video của một kênh nằm trong một trang, mới nhất ở trên:
  [kênh 8](https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/kenh-8.md) ·
  [kênh 9](https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/kenh-9.md) ·
  [kênh 10](https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/kenh-10.md) ·
  [kênh 11](https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/kenh-11.md)
  (trang có sau video đầu tiên của repo).
- **Tải video về sớm:** mỗi tuần máy xóa video của phiếu đã đóng quá 2 ngày, hoặc phiếu không có hoạt động trong
  14 ngày; khi đó link hết hiệu lực. Video luôn nhẹ hơn 100 MB.

## Cài đặt (làm một lần)

- **Actions → Tạo nhãn → Run workflow**: tạo các nhãn của phiếu.
- Hai khóa `CLAUDE_TASK_URL` và `CLAUDE_TASK_TOKEN` (Settings → Secrets) để GitHub gọi Claude sau mỗi bước. Chưa có hai
  khóa thì phiếu chờ: mở một chat với Claude và nhờ làm tiếp. Không có lượt chạy mỗi giờ: nếu Claude lỡ một lần gọi
  (ví dụ hết hạn mức), vào **Actions → Gọi Claude ngay → Run workflow**.

## Chưa làm

- Giao diện và giọng riêng cho từng kênh (tiêu đề cố định, huy hiệu xếp hạng cho kênh 8, màu riêng, giọng khác): làm
  sau, khi mày duyệt video thử 20 giây của từng kênh. Hiện cả 4 kênh dùng chung cách edit của Tin Nhật và giọng
  青山龍星.

Chi tiết cho Claude: `CLAUDE.md` (luật, cách viết, cách edit, câu mở đầu), `AGENT_REMIX.md` (việc ở từng bước).
Máy dựng là máy của kênh Tin Nhật (`japan-news-video-factory`).
