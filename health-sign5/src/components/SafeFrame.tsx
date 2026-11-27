import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';

/**
 * Khung chứa mọi chữ quan trọng: nằm gọn trong vùng an toàn TikTok
 * (cách đáy 380px, cách mép phải 140px).
 */
export const SafeFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      top: theme.safe.top,
      left: theme.safe.left,
      right: theme.safe.right,
      bottom: theme.safe.bottom,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: theme.font.family,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Lớp kiểm tra: tô đỏ các dải cấm đặt chữ. Bật bằng --props='{"showSafeArea":true}'. */
export const SafeAreaGuide: React.FC = () => {
  const band: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 60, 0.32)',
    outline: '2px dashed rgba(255,255,255,0.9)',
    outlineOffset: -2,
  };
  return (
    <AbsoluteFill>
      <div style={{ ...band, left: 0, right: 0, bottom: 0, height: theme.safe.bottom }} />
      <div style={{ ...band, top: 0, bottom: 0, right: 0, width: theme.safe.right }} />
      <div style={{ ...band, left: 0, right: 0, top: 0, height: theme.safe.top, opacity: 0.5 }} />
    </AbsoluteFill>
  );
};
