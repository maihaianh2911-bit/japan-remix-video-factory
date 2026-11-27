import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/yusei-magic/400.css';
import {Subway, SUBWAY_SECONDS} from './Subway';
import {ShinkansenVideo, SHINKANSEN_SECONDS} from './Shinkansen';

export const Root: React.FC = () => (
  <>
    <Composition id="Subway" component={Subway} durationInFrames={Math.round(SUBWAY_SECONDS * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Shinkansen" component={ShinkansenVideo} durationInFrames={Math.round(SHINKANSEN_SECONDS * 30)} fps={30} width={1080} height={1920} />
  </>
);
