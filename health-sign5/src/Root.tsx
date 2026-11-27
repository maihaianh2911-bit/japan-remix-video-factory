import React from 'react';
import { Composition } from 'remotion';
import { script, totalSeconds } from './script';
import { theme } from './theme';
import { Video, type VideoProps } from './Video';

export const Root: React.FC = () => {
  const { width, height, fps } = theme.video;
  return (
    <Composition
      id="Intro"
      component={Video}
      width={width}
      height={height}
      fps={fps}
      durationInFrames={Math.round(totalSeconds * fps)}
      defaultProps={{ script, showSafeArea: false } satisfies VideoProps}
    />
  );
};
