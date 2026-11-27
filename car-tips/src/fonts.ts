import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import '@fontsource/noto-sans-jp/500.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';

const WEIGHTS = [500, 700, 900];

/**
 * Noto Sans JP của @fontsource chia thành hơn 100 mảnh nhỏ (unicode-range),
 * trình duyệt chỉ tải mảnh nào có chữ đang dùng. Hook này giữ Remotion chờ
 * đến khi mọi mảnh cần cho `text` tải xong rồi mới chụp frame — nếu không,
 * vài frame đầu sẽ ra font dự phòng.
 */
export const useFonts = (text: string): void => {
  const [handle] = useState(() => delayRender('Tải font Noto Sans JP'));

  useEffect(() => {
    Promise.all(
      WEIGHTS.map((w) => document.fonts.load(`${w} 48px "Noto Sans JP"`, text)),
    )
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle, text]);
};
