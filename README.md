# Japan Remix Video Factory

Máy làm video dọc tiếng Nhật (1080 × 1920, dài hơn 61 giây một chút) cho kênh 10 (hoàng gia thế giới; kênh 8, 9 và 11 đã bỏ từ 26/11/2026). Cách làm: mày gửi video
của kênh khác, Claude kể lại câu chuyện đó bằng lời của mình bằng tiếng Nhật (giữ đúng sự thật, không bịa, không chép
nguyên văn), tìm ảnh thật, máy đọc bằng giọng VOICEVOX và dựng video, Claude kiểm tra lại từng cảnh.

Video được edit giống hệt kênh Tin Nhật: ảnh lớn kiểu trang báo cũ, câu mở đầu in to trên ảnh đầu, ảnh chuyển động
có chiều sâu, chữ hiện theo giọng đọc, nhạc nền nhẹ, mỗi cảnh 2 ảnh, Claude duyệt từng ảnh trước khi dựng.

## Kênh

| Kênh | Mẫu phiếu | Nội dung | Kênh tham khảo |
| --- | --- | --- | --- |
| 10 | 👑 Kênh 10 · Hoàng gia thế giới | hoàng gia Anh, hoàng tộc Trung Quốc ngày xưa | 皇室の記憶 |

Luật riêng của kênh để tránh bị kiện và bị YouTube phạt: không chế giễu ai; kênh 10 được kể tin đồn (cả tin báo lá
cải), nói rõ là tin đồn và đính chính ở caption. Claude theo các luật này khi viết lại.

## Làm một video

1. Vào **Issues → New issue**, chọn mẫu của kênh 10.
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
  [kênh 10](https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/kenh-10.md)
  (trang có sau video đầu tiên của repo).
- **Tải video về sớm:** mỗi tuần máy xóa video của phiếu đã đóng quá 2 ngày, hoặc phiếu không có hoạt động trong
  14 ngày; khi đó link hết hiệu lực. Video luôn nhẹ hơn 100 MB.

## Cài đặt (làm một lần)

- **Actions → Tạo nhãn → Run workflow**: tạo các nhãn của phiếu.
- Hai khóa `CLAUDE_TASK_URL` và `CLAUDE_TASK_TOKEN` (Settings → Secrets) để GitHub gọi Claude sau mỗi bước. Chưa có hai
  khóa thì phiếu chờ: mở một chat với Claude và nhờ làm tiếp. Không có lượt chạy mỗi giờ: nếu Claude lỡ một lần gọi
  (ví dụ hết hạn mức), vào **Actions → Gọi Claude ngay → Run workflow**.

## Ghi chú 19/11/2026: luật ảnh của phần edit (mày duyệt)

**Ảnh mở đầu (5 giây đầu):** (1) là ảnh đẹp nhất của cả video: nét, sáng, không mờ, không vỡ hạt; (2) thấy rõ mặt nhân
vật chính, hoặc một nơi hay một vật người Nhật nhìn là nhận ra ngay; (3) khớp với câu mở đầu; (4) là ảnh chụp, không
phải trang báo, tài liệu, ảnh ghép chữ hay ảnh có logo; (5) mặt nằm ở nửa trên của khung, không bị dòng chữ mở đầu che.

**Mặt người (mọi cảnh):** (6) cả khuôn mặt, từ trán tới cằm, nằm trọn trong khung suốt thời gian ảnh hiện, kể cả lúc
zoom hay lia; (7) chữ trên hình không đè lên mặt; (8) ảnh nhiều người thì người đang được nhắc tới phải rõ nhất; (9)
cảnh nói về một người thì không dùng ảnh mà mặt người đó quá nhỏ.

**Mọi ảnh:** (10) không tìm được ảnh đạt thì tìm thêm; vẫn không có thì báo mày cảnh nào thiếu, không lấy ảnh kém cho xong.

Mày không nhận hai ý "một ảnh chỉ dùng một lần" và "ảnh cuối cũng phải đẹp", nên đó không phải luật.

Máy tự xem giúp ba việc khi xem trước: ảnh mở đầu quá nhỏ hoặc là ảnh tài liệu; mặt bị khung cắt hay trôi ra ngoài lúc
ảnh chuyển động (kèm gợi ý cách canh khung nếu canh được); mặt nằm dưới dòng chữ. Những ý còn lại Claude phải tự nhìn.

## Ghi chú 19/11/2026: mày đổi 6 luật

Mày đọc danh sách luật cứng và thấy mấy luật "ko hợp lí", rồi chọn lại như sau (áp dụng cho mọi kênh tiếng Nhật):

1. **Kịch bản mày gửi:** Claude được cắt, thêm, viết lại cho hay và cuốn hơn, giữ ý chính của mày (trước: dịch sát, không sửa).
2. **Tin đồn:** kênh nào cũng được kể tin đồn và chi tiết chưa xác nhận, có câu kiểu "nghe nói" trong lời đọc và ghi chú đính chính (※) ở caption.
3. **Thêm thắt cho kịch tính:** được thêm cảm xúc, lời dẫn, cách kể. Điều duy nhất còn cấm: dựng ra sự kiện hay câu nói của người thật rồi kể như thật.
4. **Câu kết:** tự do, miễn hay (trước: phải quay về câu mở đầu, không được hỏi người xem).
5. **Giọng và nhạc của video mày gửi:** được dùng. Rủi ro đã nói: nhạc có bản quyền dễ bị YouTube nhận ra (tắt tiếng, mất tiền quảng cáo, gậy), và dùng càng nhiều của video gốc thì càng dễ bị coi là "nội dung dùng lại". Máy dựng hiện chưa chèn được tiếng của video gốc: phải làm thêm và có bản thử cho mày duyệt.
6. **Số ảnh mỗi cảnh:** cảnh dài hơn 6 giây thì phải có 2 ảnh, dưới 6 giây thì 1 ảnh cũng được (trước: cảnh nào cũng 2 ảnh).

## Ghi chú 19/11/2026: tìm ảnh rộng hơn (như kênh Tin Nhật)

- **Tìm web rộng hơn** (`web:`): mỗi lần tìm máy xem khoảng 55 ảnh (trước là 20), giữ 20 ảnh (trước là 12); ảnh nào
  trang gốc không cho tải thì lấy bản sao cùng cỡ mà Yahoo! JAPAN đang giữ.
- **Lấy ảnh trong một bài báo** (`page:` + link bài): các ảnh lớn của đúng bài đó, tối đa 20 ảnh.
- **Kho lưu trữ Nhật** (`jps:`): Japan Search (thư viện quốc hội, thư viện và kho lưu trữ các thành phố…), chỉ ảnh
  được phép dùng; nên tìm theo sự việc, địa danh, đồ vật chứ không theo tên người. Nguồn này khiêm tốn (thử 6 lần
  tìm: 2 lần được 12 ảnh, 2 lần được 1–2 ảnh, 2 lần không được ảnh nào); ảnh của các bảo tàng quốc gia (ColBase)
  hiện chưa tải được.
- **Hình từ video mày gửi**: `tools/video_frames.py` bày mỗi cảnh của video thành một ô để Claude chọn, rồi cất hình
  đã chọn vào repo (ghi nguồn 元動画). Đoạn video chuyển động thì mày cũng cho dùng, nhưng khung hình hiện chỉ hiện ảnh
  tĩnh: muốn chèn đoạn video phải làm thêm và có bản thử cho mày duyệt.
- **Bớt báo đỏ giả**: nguồn ảnh không bao giờ lấy được chỉ còn là một dòng ghi chú, máy không báo lỗi và không thử lại.

## Chưa làm

- Giao diện và giọng riêng cho từng kênh (tiêu đề cố định, màu riêng, giọng khác): làm
  sau, khi mày duyệt video thử 20 giây của từng kênh. Hiện kênh 10 dùng cách edit của Tin Nhật, giọng nữ もち子さん (cùng giọng mày chốt cho video Hoàng gia Nhật, 25/11) và nhạc sáo trúc mày gửi.

Chi tiết cho Claude: `CLAUDE.md` (luật, cách viết, cách edit, câu mở đầu), `AGENT_REMIX.md` (việc ở từng bước).
Máy dựng là máy của kênh Tin Nhật (`japan-news-video-factory`).
