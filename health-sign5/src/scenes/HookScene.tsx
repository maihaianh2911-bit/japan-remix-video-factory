import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Headline } from '../components/Headline';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { SafeFrame } from '../components/SafeFrame';
import { Scrim } from '../components/Scrim';
import { Sfx } from '../components/Sfx';
import type { HookScene as HookData, VideoScript } from '../script';
import { theme } from '../theme';

type Props = { scene: HookData; script: VideoScript; durationInFrames: number };

const ENTER = 5;

/** Cảnh mở đầu: câu hỏi gây tò mò, chữ to bật vào từng dòng. */
export const HookScene: React.FC<Props> = ({ scene, script, durationInFrames }) => (
  <AbsoluteFill>
    <KenBurnsImage src={scene.image} position={scene.imagePosition} zoom={scene.imageZoom} durationInFrames={durationInFrames} />
    <Scrim />
    <SafeFrame style={{ justifyContent: 'flex-end', paddingBottom: 70 }}>
      <Headline text={scene.headline} size={theme.size.hook} enterFrame={ENTER} stagger={6} />
    </SafeFrame>
    <Sfx name="pop" at={ENTER} volume={script.sfxVolume} />
  </AbsoluteFill>
);
