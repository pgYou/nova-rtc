import { WebVisionSourceType } from '../WebRtc';
import type { BaseVisionMediaSource } from './source/BaseSource';
import { TextSourceConstraintType } from './source/TextSource';
import { WebCameraVideoSourceConstraintType } from './source/WebCameraVideoSource';
import { WebDisplayVideoSourceConstraintType } from './source/WebDisplayVideoSource';
import { WebImageSourceConstraintType } from './source/WebImageSource';

export interface IVideoMixingParams {
  frameRate?: number;
  width: number;
  height: number;
  backgroundColor?: string;
}
export interface IMixingConfig {
  videoSource: BaseVisionMediaSource;
  rect: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  /**
   * 旋转角度 0- 2*Math.PI
   */
  rotate?: number;
  order: number;
}
export type VisionMediaElement =
  | HTMLVideoElement
  | HTMLCanvasElement
  | HTMLImageElement;

export interface IFontStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
}
export interface IDrawTextParams extends IFontStyle {
  fillStyle?: string | CanvasGradient | CanvasPattern;
}

export type SourceConfigConstraintType = WebCameraVideoSourceConstraintType &
  WebImageSourceConstraintType &
  TextSourceConstraintType &
  WebDisplayVideoSourceConstraintType;

export type SourceConfigType = Omit<IMixingConfig, 'videoSource'> & {
  sourceType: WebVisionSourceType;
  deviceId: string;
  // 描述一个源的配置
  constraint: SourceConfigConstraintType;
};

export interface ISourSize {
  width: number;
  height: number;
  aspectRatio: number;
}
