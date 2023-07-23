import { EventEmitter } from 'events';
import { VisionMediaElement } from '../interface';

export abstract class BaseVisionMediaSource extends EventEmitter {
  public visionMedia: VisionMediaElement;

  constructor(visionMedia: VisionMediaElement) {
    super();
    this.visionMedia = visionMedia;
  }
  async requestFrame() {}

  dispose(): void {
    // @ts-ignore
    delete this.visionMedia;
  }
  static createAndInit(constraint: unknown): BaseVisionMediaSource {
    throw new Error('need implement');
  }
}

export abstract class BaseVideoSource extends BaseVisionMediaSource {
  constructor() {
    super(document.createElement('video'));
    this.video.muted = true;
  }
  get video(): HTMLVideoElement {
    return this.visionMedia as HTMLVideoElement;
  }

  dispose(): void {
    super.dispose();
  }
}

export abstract class BaseCanvasSource extends BaseVisionMediaSource {
  protected context2d: CanvasRenderingContext2D;
  constructor() {
    super(document.createElement('canvas'));
    this.context2d = this.canvas.getContext('2d')!;
  }
  get canvas() {
    return this.visionMedia as HTMLCanvasElement;
  }

  dispose(): void {
    // @ts-ignore
    this.context2d = undefined;
    super.dispose();
  }
}
