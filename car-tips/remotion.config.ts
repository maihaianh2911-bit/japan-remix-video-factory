import { Config } from '@remotion/cli/config';

// Xuất H.264, CRF 18 (số càng nhỏ càng nét, file càng nặng).
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');
