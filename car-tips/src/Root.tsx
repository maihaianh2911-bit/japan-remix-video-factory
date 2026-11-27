import React from 'react';
import { Composition } from 'remotion';
import { CarTips } from './CarTips';
import { DURATION, FPS } from './time';

export const Root: React.FC = () => (
  <Composition id="CarTips" component={CarTips} durationInFrames={Math.ceil(DURATION * FPS)} fps={FPS} width={1080} height={1920} />
);
