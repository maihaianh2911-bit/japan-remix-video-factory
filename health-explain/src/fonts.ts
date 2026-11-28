import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import '@fontsource/noto-sans-jp/500.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';

/** Giữ Remotion chờ tới khi mọi mảnh font Noto Sans JP cần cho `text` tải xong. */
export const useFonts = (text: string): void => {
  const [handle] = useState(() => delayRender('Tải font Noto Sans JP'));
  useEffect(() => {
    Promise.all([500, 700, 900].map((w) => document.fonts.load(`${w} 48px "Noto Sans JP"`, text)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle, text]);
};
