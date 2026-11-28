import React from 'react';
import { Composition } from 'remotion';
import { FPS } from './time';
import { Hounichi } from './videos/Hounichi';
import { Ijime } from './videos/Ijime';
import hounichi from './videos/hounichi.timing.json';
import ijime from './videos/ijime.timing.json';

// Mỗi video tin một Composition (id = tên trong stories/).
export const Root: React.FC = () => (
  <>
    <Composition id="hounichi" component={Hounichi} durationInFrames={Math.ceil(hounichi.duration * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="ijime" component={Ijime} durationInFrames={Math.ceil(ijime.duration * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
