import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/yusei-magic/400.css';
import {Trial, DURATION} from './Trial';

export const Root: React.FC = () => (
  <Composition id="Trial" component={Trial} durationInFrames={Math.round(DURATION * 30)} fps={30} width={1080} height={1920} />
);
