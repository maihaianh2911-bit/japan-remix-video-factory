import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ExplainBox } from '../components/ExplainBox';
import { Headline } from '../components/Headline';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { SafeFrame } from '../components/SafeFrame';
import { Scrim } from '../components/Scrim';
import { Sfx } from '../components/Sfx';
import { SignBadge } from '../components/SignBadge';
import { SourceLine } from '../components/SourceLine';
import type { SignScene as SignData, VideoScript } from '../script';
import { theme } from '../theme';
import { f } from '../time';

type Props = { scene: SignData; script: VideoScript; durationInFrames: number };

/** Cảnh 「サインN」: huy hiệu + chấm tiến độ ở trên; chữ chính, hộp giải thích, nguồn ở dưới. */
export const SignScene: React.FC<Props> = ({ scene, script, durationInFrames }) => {
  const headlineAt = f((scene.headlineAt ?? scene.start + 0.35) - scene.start);

  return (
    <AbsoluteFill>
      <KenBurnsImage src={scene.image} position={scene.imagePosition} zoom={scene.imageZoom} durationInFrames={durationInFrames} />
      <Scrim />
      <SafeFrame style={{ justifyContent: 'space-between' }}>
        <div style={{ paddingTop: 34 }}>
          <SignBadge number={scene.number} total={script.totalSigns} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 14 }}>
          <Headline text={scene.headline} size={theme.size.headline} enterFrame={headlineAt} />
          <div style={{ height: 34 }} />
          <ExplainBox phrases={scene.explain} sceneStart={scene.start} />
          <div style={{ height: 22 }} />
          <SourceLine text={script.source} />
        </div>
      </SafeFrame>
      <Sfx name="whoosh" at={0} volume={script.sfxVolume * 0.8} />
      <Sfx name="pop" at={headlineAt} volume={script.sfxVolume} />
    </AbsoluteFill>
  );
};
