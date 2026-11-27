import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SafeAreaGuide } from './components/SafeFrame';
import { SceneTransition } from './components/SceneTransition';
import { useFonts } from './fonts';
import { HookScene } from './scenes/HookScene';
import { SignScene } from './scenes/SignScene';
import { TitleScene } from './scenes/TitleScene';
import type { Scene, VideoScript } from './script';
import { theme } from './theme';
import { f } from './time';

export type VideoProps = {
  script: VideoScript;
  /** Tô đỏ vùng cấm đặt chữ (chỉ để kiểm tra) */
  showSafeArea: boolean;
};

const renderScene = (scene: Scene, script: VideoScript, durationInFrames: number) => {
  switch (scene.type) {
    case 'hook':
      return <HookScene scene={scene} script={script} durationInFrames={durationInFrames} />;
    case 'title':
      return <TitleScene scene={scene} script={script} durationInFrames={durationInFrames} />;
    case 'sign':
      return <SignScene scene={scene} script={script} durationInFrames={durationInFrames} />;
  }
};

/** Mọi chữ có trong video — để tải đủ các mảnh font trước khi chụp frame. */
const allText = (script: VideoScript): string =>
  [
    script.source,
    'サイン0123456789',
    ...script.scenes.flatMap((s) => [
      s.headline,
      s.type === 'title' ? s.sub : '',
      ...(s.type === 'sign' ? s.explain.map((p) => p.text) : []),
    ]),
  ].join('');

export const Video: React.FC<VideoProps> = ({ script, showSafeArea }) => {
  useFonts(allText(script));
  const T = theme.motion.transitionFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {script.scenes.map((scene, i) => {
        const from = f(scene.start);
        const own = f(scene.end) - from;
        const isLast = i === script.scenes.length - 1;
        // Cảnh ở lại thêm T frame để cảnh sau mờ dần đè lên (trừ cảnh cuối).
        const visible = own + (isLast ? 0 : T);
        return (
          <Sequence key={scene.id} name={scene.id} from={from} durationInFrames={visible}>
            <SceneTransition enter={i > 0} exitAt={isLast ? null : own}>
              {renderScene(scene, script, visible)}
            </SceneTransition>
          </Sequence>
        );
      })}

      {script.voiceFile ? <Audio src={staticFile(script.voiceFile)} volume={script.voiceVolume} /> : null}
      {showSafeArea ? <SafeAreaGuide /> : null}
    </AbsoluteFill>
  );
};
