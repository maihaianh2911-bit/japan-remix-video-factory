import React from 'react';
import { AbsoluteFill } from 'remotion';

type Props = {
  /** Phủ tối thêm toàn ảnh (0–1), dùng cho cảnh tiêu đề */
  dim?: number;
};

/** Gradient tối từ giữa màn hình xuống dưới để chữ dễ đọc, kèm một dải mỏng phía trên cho huy hiệu. */
export const Scrim: React.FC<Props> = ({ dim = 0 }) => (
  <>
    {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} /> : null}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 17%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.62) 60%, rgba(0,0,0,0.9) 100%)',
      }}
    />
  </>
);
