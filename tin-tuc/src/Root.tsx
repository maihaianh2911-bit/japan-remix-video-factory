import React from 'react';
import { Composition } from 'remotion';
import { News } from './News';
import { DURATION, FPS } from './time';

export const Root: React.FC = () => (
  <Composition id="News" component={News} durationInFrames={Math.ceil(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
);
