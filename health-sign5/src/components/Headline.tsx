import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';
import { fitFontSize, parseRich } from '../text';
import { safeWidth } from '../time';

type Props = {
  /** Chữ có {từ khóa} và \n */
  text: string;
  /** Cỡ chữ mong muốn (tự thu nhỏ nếu dòng quá dài) */
  size: number;
  /** Frame (tính trong cảnh) chữ bật vào */
  enterFrame: number;
  /** Độ trễ giữa các dòng (frame) */
  stagger?: number;
};

/**
 * Chữ chính: to, trắng, viền đen dày, từ khóa tô vàng, bật nảy vào bằng spring().
 * Viền vẽ bằng lớp chữ đen nằm dưới (stroke) + lớp chữ màu nằm trên, nên nét chữ không bị viền ăn mất.
 */
export const Headline: React.FC<Props> = ({ text, size, enterFrame, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = parseRich(text);
  const stroke = Math.round((theme.size.headlineStroke * size) / theme.size.headline);
  const fontSize = fitFontSize(text, size, safeWidth - stroke);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: theme.font.family,
        fontWeight: theme.font.title,
        fontSize,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))',
      }}
    >
      {lines.map((line, i) => {
        const local = frame - enterFrame - i * stagger;
        const s = spring({ frame: local, fps, config: theme.motion.pop });
        const scale = interpolate(s, [0, 1], [0.35, 1]);
        const opacity = interpolate(local, [0, 3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const layer: React.CSSProperties = { gridArea: '1 / 1', display: 'block' };
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              transform: `scale(${scale})`,
              transformOrigin: '50% 60%',
              opacity,
            }}
          >
            {/* lớp viền */}
            <span
              aria-hidden
              style={{
                ...layer,
                color: theme.colors.stroke,
                WebkitTextStroke: `${stroke}px ${theme.colors.stroke}`,
                strokeLinejoin: 'round',
              }}
            >
              {line.map((seg) => seg.text).join('')}
            </span>
            {/* lớp chữ */}
            <span style={layer}>
              {line.map((seg, j) => (
                <span key={j} style={{ color: seg.accent ? theme.colors.accent : theme.colors.text }}>
                  {seg.text}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};
