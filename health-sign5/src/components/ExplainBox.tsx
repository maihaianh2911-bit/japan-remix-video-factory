import React from 'react';
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ExplainPhrase } from '../script';
import { theme } from '../theme';
import { fitFontSize } from '../text';
import { f, safeWidth } from '../time';

type Props = {
  phrases: ExplainPhrase[];
  /** Giây bắt đầu cảnh (để đổi mốc tuyệt đối → frame trong cảnh) */
  sceneStart: number;
};

const PAD_X = 40;
/** Hộp hiện ra trước cụm đầu tiên bấy nhiêu giây */
const LEAD = 0.45;
/** Một cụm sáng lên trong bấy nhiêu frame */
const LIGHT_FRAMES = 9;

/** Hộp giải thích bán trong suốt; chữ sáng dần theo từng cụm khi được đọc. */
export const ExplainBox: React.FC<Props> = ({ phrases, sceneStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (phrases.length === 0) return null;

  const enter = f(phrases[0].at - sceneStart - LEAD);
  const s = spring({ frame: frame - enter, fps, config: theme.motion.soft });
  const fullText = phrases.map((p) => p.text).join('').replace(/\n$/, '');
  const fontSize = fitFontSize(fullText, theme.size.explain, safeWidth - PAD_X * 2 - 8);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        maxWidth: safeWidth,
        padding: `26px ${PAD_X}px 30px`,
        borderRadius: 28,
        backgroundColor: theme.colors.boxBg,
        border: `2px solid ${theme.colors.boxBorder}`,
        fontFamily: theme.font.family,
        fontWeight: theme.font.body,
        fontSize,
        lineHeight: 1.5,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [46, 0])}px)`,
      }}
    >
      {phrases.map((p, i) => {
        const at = f(p.at - sceneStart);
        const color = interpolateColors(
          frame,
          [at, at + LIGHT_FRAMES],
          [theme.colors.textDim, theme.colors.text],
        );
        const parts = p.text.split('\n');
        return (
          <span key={i} style={{ color }}>
            {parts.map((part, j) => (
              <React.Fragment key={j}>
                {j > 0 ? <br /> : null}
                {part}
              </React.Fragment>
            ))}
          </span>
        );
      })}
    </div>
  );
};
