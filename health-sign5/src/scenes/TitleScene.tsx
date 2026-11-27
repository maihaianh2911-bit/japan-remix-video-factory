import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Headline } from '../components/Headline';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { SafeFrame } from '../components/SafeFrame';
import { Scrim } from '../components/Scrim';
import { Sfx } from '../components/Sfx';
import { SourceLine } from '../components/SourceLine';
import type { TitleScene as TitleData, VideoScript } from '../script';
import { theme } from '../theme';
import { fitFontSize } from '../text';
import { f, safeWidth } from '../time';

type Props = { scene: TitleData; script: VideoScript; durationInFrames: number };

const ENTER = 9;
const SUB_PAD_X = 40;

/** Cảnh tiêu đề: 「睡眠不足のサイン5選」 + dòng phụ trên nền vàng. */
export const TitleScene: React.FC<Props> = ({ scene, script, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subAt = f(scene.subAt - scene.start);
  const s = spring({ frame: frame - subAt, fps, config: theme.motion.pop });

  return (
    <AbsoluteFill>
      <KenBurnsImage src={scene.image} position={scene.imagePosition} zoom={scene.imageZoom} durationInFrames={durationInFrames} />
      <Scrim dim={0.38} />
      <SafeFrame style={{ justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, marginBottom: 70 }}>
          <Headline text={scene.headline} size={theme.size.title} enterFrame={ENTER} stagger={6} />
          <div
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.accentDark,
              fontFamily: theme.font.family,
              fontWeight: theme.font.title,
              fontSize: fitFontSize(scene.sub, theme.size.titleSub, safeWidth - SUB_PAD_X * 2 - 10),
              lineHeight: 1,
              padding: `24px ${SUB_PAD_X}px 26px`,
              borderRadius: 999,
              border: `5px solid ${theme.colors.stroke}`,
              whiteSpace: 'nowrap',
              boxShadow: '0 10px 22px rgba(0,0,0,0.5)',
              transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`,
              opacity: interpolate(frame - subAt, [0, 3], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {scene.sub}
          </div>
        </div>
        <div style={{ paddingBottom: 14 }}>
          <SourceLine text={script.source} enterFrame={ENTER + 10} />
        </div>
      </SafeFrame>
      <Sfx name="whoosh" at={0} volume={script.sfxVolume * 0.8} />
      <Sfx name="pop" at={ENTER} volume={script.sfxVolume} />
      <Sfx name="pop" at={subAt} volume={script.sfxVolume * 0.75} />
    </AbsoluteFill>
  );
};
