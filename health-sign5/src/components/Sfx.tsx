import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';

type Props = {
  name: 'pop' | 'whoosh';
  /** Frame (trong cảnh) phát âm */
  at: number;
  volume: number;
};

/** Phát một hiệu ứng âm thanh trong public/sfx/ tại frame `at`. */
export const Sfx: React.FC<Props> = ({ name, at, volume }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={30} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
