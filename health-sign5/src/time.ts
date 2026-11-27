import { theme } from './theme';

/** Giây → frame */
export const f = (seconds: number): number => Math.round(seconds * theme.video.fps);

/** Bề ngang dành cho chữ bên trong vùng an toàn */
export const safeWidth =
  theme.video.width - theme.safe.left - theme.safe.right;
