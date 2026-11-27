import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { fitFontSize } from '../text';
import { safeWidth } from '../time';

/** Dòng nguồn nhỏ: 「出典:厚生労働省 …」 */
export const SourceLine: React.FC<{ text: string; enterFrame?: number }> = ({ text, enterFrame = 8 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: theme.font.family,
        fontWeight: theme.font.small,
        fontSize: fitFontSize(text, theme.size.source, safeWidth),
        lineHeight: 1.4,
        color: theme.colors.source,
        whiteSpace: 'nowrap',
        textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
        opacity: interpolate(frame - enterFrame, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {text}
    </div>
  );
};
