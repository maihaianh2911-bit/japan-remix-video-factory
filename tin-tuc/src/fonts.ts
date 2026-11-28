import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import '@fontsource/noto-sans-jp/500.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';
import '@fontsource/noto-serif-jp/700.css';
import '@fontsource/noto-serif-jp/900.css';

/** Giữ Remotion chờ tới khi mọi mảnh font cần cho `text` tải xong (cả chữ gothic lẫn chữ kiểu báo). */
export const useFonts = (text: string): void => {
  const [handle] = useState(() => delayRender('Tải font Noto Sans JP / Noto Serif JP'));
  useEffect(() => {
    Promise.all([
      ...[500, 700, 900].map((w) => document.fonts.load(`${w} 48px "Noto Sans JP"`, text)),
      ...[700, 900].map((w) => document.fonts.load(`${w} 48px "Noto Serif JP"`, text)),
    ])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle, text]);
};
