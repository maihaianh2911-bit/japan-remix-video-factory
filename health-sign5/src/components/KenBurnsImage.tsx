import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { theme } from '../theme';

type Props = {
  /** Đường dẫn trong public/, vd "images/hook.jpg" */
  src: string;
  /** CSS object-position: điểm giữ lại khi cắt dọc, cũng là tâm zoom */
  position?: string;
  /** Phóng to sẵn từ đầu (1 = vừa khít màn hình) */
  zoom?: number;
  /** Số frame cảnh hiện trên màn hình (zoom chạy suốt khoảng này) */
  durationInFrames: number;
};

/** Ảnh phủ kín màn hình, zoom chậm 1.0 → 1.08 trong cả cảnh. */
export const KenBurnsImage: React.FC<Props> = ({ src, position = '50% 40%', zoom = 1, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { kenBurnsFrom, kenBurnsTo } = theme.motion;
  const scale = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [kenBurnsFrom, kenBurnsTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          transform: `scale(${scale * zoom})`,
          transformOrigin: position,
        }}
      />
    </AbsoluteFill>
  );
};
