import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

type Props = {
  number: number;
  total: number;
  /** Frame (trong cảnh) huy hiệu xuất hiện */
  enterFrame?: number;
};

/** Huy hiệu vàng 「サイン1」 + 5 chấm tiến độ. */
export const SignBadge: React.FC<Props> = ({ number, total, enterFrame = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - enterFrame, fps, config: theme.motion.pop });
  const dot = spring({ frame: frame - enterFrame - 8, fps, config: theme.motion.pop });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        transform: `translateY(${interpolate(s, [0, 1], [-70, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        opacity: interpolate(frame - enterFrame, [0, 4], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.accent,
          color: theme.colors.accentDark,
          fontFamily: theme.font.family,
          fontWeight: theme.font.title,
          fontSize: theme.size.badge,
          lineHeight: 1,
          padding: '18px 38px 20px',
          borderRadius: 999,
          border: `5px solid ${theme.colors.stroke}`,
          whiteSpace: 'nowrap',
        }}
      >
        サイン{number}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {Array.from({ length: total }, (_, i) => {
          const done = i < number;
          const current = i === number - 1;
          return (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: done ? theme.colors.accent : theme.colors.dotOff,
                border: `4px solid ${theme.colors.stroke}`,
                transform: current ? `scale(${interpolate(dot, [0, 1], [0.6, 1.3])})` : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
