import { ISourSize } from '../interface'
import { BaseVideoSource } from './BaseSource'

export type WebDisplayVideoSourceConstraintType = {
  mediaStream?: MediaStream
}

export default class WebDisplayVideoSource extends BaseVideoSource {
  protected mediaStream?: MediaStream

  constructor() {
    super()
  }
  startCapture(media: MediaStream): void {
    this.mediaStream = media
    this.video.srcObject = media
    this.video.play()
  }
  stopCapture() {
    // 释放所与的 audiotrack 和 videotrack
    this.mediaStream?.getTracks().map((track) => {
      track.stop()
    })
    this.mediaStream = undefined
  }
  dispose(): void {
    this.stopCapture()
    delete this.mediaStream
    super.dispose()
  }

  static async getDisplayMediaStream(): Promise<{
    mediaStream: MediaStream
    size: ISourSize
  }> {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia()
    const video = document.createElement('video')
    video.srcObject = mediaStream
    video.muted = true
    video.play()
    function dispose() {
      video.srcObject = null
    }
    return new Promise((resolve, reject) => {
      video.addEventListener(
        'loadeddata',
        () => {
          resolve({
            mediaStream,
            size: {
              height: video.videoHeight,
              width: video.videoWidth,
              aspectRatio: video.videoWidth / video.videoHeight,
            },
          })
          dispose()
        },
        { once: true }
      )
      video.addEventListener('error', (e) => {
        dispose()
        reject(e)
      })
    })
  }

  static createAndInit(constraint: WebDisplayVideoSourceConstraintType) {
    const source = new WebDisplayVideoSource()
    if (constraint.mediaStream) {
      source.startCapture(constraint.mediaStream)
    } else {
      throw new Error('need mediaStream')
    }
    return source
  }
}
