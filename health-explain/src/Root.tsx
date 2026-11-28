import React from 'react';
import { Composition } from 'remotion';
import { FPS } from './time';
import { HiyaGohan } from './videos/HiyaGohan';
import hiyagohan from './videos/hiyagohan.timing.json';

// Mỗi video một Composition (id = tên trong stories/). Video dài hơn giọng 0.8 giây cho cảnh cuối đứng lại.
export const Root: React.FC = () => (
  <>
    <Composition id="hiyagohan" component={HiyaGohan} durationInFrames={Math.ceil((hiyagohan.duration + 0.8) * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
