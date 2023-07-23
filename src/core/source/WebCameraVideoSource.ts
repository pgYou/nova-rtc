import { BaseVideoSource } from './BaseSource';

export type WebCameraVideoSourceConstraintType = MediaTrackConstraintSet;

export default class WebCameraVideoSource extends BaseVideoSource {
  protected mediastream?: MediaStream;
  constructor() {
    super();
  }

  async startCapture(constraints: MediaTrackConstraints) {
    const media = await navigator.mediaDevices.getUserMedia({
      video: constraints,
    });
    this.mediastream = media;
    this.video.srcObject = media;
    this.video.play();
  }

  stopCapture() {
    // 释放所与的audiotrack和videotrack
    this.mediastream?.getTracks().map((track) => {
      track.stop();
    });
    this.mediastream = undefined;
  }

  dispose(): void {
    this.stopCapture();
    delete this.mediastream;
    super.dispose();
  }

  static async getCameraList() {
    const list = await navigator.mediaDevices.enumerateDevices();
    return list.filter((device) => device.kind === 'videoinput');
  }

  static async requestUserMediaPermission() {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    media?.getTracks().map((track) => {
      track.stop();
    });
  }
  static createAndInit(constraint: WebCameraVideoSourceConstraintType) {
    const source = new WebCameraVideoSource();
    source.startCapture(constraint as MediaTrackConstraintSet);
    return source;
  }
}
