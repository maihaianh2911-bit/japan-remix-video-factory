import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';

type Props = {
  children: React.ReactNode;
  /** Mờ + trượt vào ở đầu cảnh */
  enter: boolean;
  /** Frame bắt đầu trượt ra (cảnh sau đang mờ dần đè lên); null = không trượt ra */
  exitAt: number | null;
};

/** Chuyển cảnh: mờ và trượt ngang nhẹ. Cảnh sau mờ dần đè lên phần đuôi của cảnh trước. */
export const SceneTransition: React.FC<Props> = ({ children, enter, exitAt }) => {
  const frame = useCurrentFrame();
  const { transitionFrames: T, slidePx } = theme.motion;
  const ease = Easing.out(Easing.cubic);

  const inP = enter
    ? interpolate(frame, [0, T], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })
    : 1;
  const outP =
    exitAt === null
      ? 0
      : interpolate(frame, [exitAt, exitAt + T], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });

  const x = (1 - inP) * slidePx - outP * slidePx;

  return (
    <AbsoluteFill style={{ opacity: inP, transform: `translateX(${x}px)` }}>{children}</AbsoluteFill>
  );
};
