import { IMixingConfig, IVideoMixingParams } from '../interface'
import { BaseCanvasSource } from './BaseSource'

export default class MixingVideoSource extends BaseCanvasSource {
  protected mediaStream?: MediaStream
  private videoMixingParams?: IVideoMixingParams

  private mixingConfigList: Array<IMixingConfig>

  private drawing = false

  private renderTaskTimer?: NodeJS.Timer

  constructor() {
    super()
    this.mixingConfigList = []
    this.context2d = this.canvas.getContext('2d') as CanvasRenderingContext2D
    document.body.append(this.canvas)
  }

  init(params: IVideoMixingParams) {
    const { frameRate = 24, backgroundColor = '#000', width, height } = params
    this.videoMixingParams = { frameRate, backgroundColor, width, height }

    this.canvas.height = height
    this.canvas.width = width
    this.canvas.style.height = height + 'px'
    this.canvas.style.width = width + 'px'
    this.mediaStream = this.canvas.captureStream(frameRate)

    this.renderTaskTimer = setInterval(() => {
      this.requestFrame()
    }, 1000 / frameRate)
  }

  updateMixingConfig(config: Array<IMixingConfig>) {
    this.mixingConfigList = config
    // this.requestFrame();
  }

  //TODO webwork
  async requestFrame() {
    if (this.drawing) return
    // console.log('requestFrame');

    this.drawing = true
    const { backgroundColor } = this.videoMixingParams || {}
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context2d.fillStyle = backgroundColor || ''
    this.context2d.fillRect(0, 0, this.canvas.width, this.canvas.height)

    const list = this.mixingConfigList.sort((a, b) => a.order - b.order)
    for (let i = 0; i < list.length; i++) {
      const sourceConfig = list[i]
      await sourceConfig.videoSource.requestFrame()

      try {
        this.renderSource(sourceConfig)
      } catch (err) {
        setTimeout(() => {
          throw err
        })
      }
    }
    this.drawing = false
  }

  private renderSource(sourceConfig: IMixingConfig) {
    const { rect, rotate = 0 } = sourceConfig
    this.context2d.save()
    const centerPointerX = rect.x + rect.width / 2
    const centerPointerY = rect.y + rect.height / 2
    this.context2d.translate(centerPointerX, centerPointerY)
    this.context2d.rotate(-rotate)
    this.context2d.drawImage(
      sourceConfig.videoSource.visionMedia,
      -rect.width / 2,
      -rect.height / 2,
      rect.width,
      rect.height
    )
    this.context2d.rotate(rotate)
    this.context2d.translate(-centerPointerX, -centerPointerY)
    this.context2d.restore()
  }

  dispose(): void {
    window.clearInterval(this.renderTaskTimer)
    // @ts-ignore
    delete this.canvas
    // @ts-ignore
    delete this.context2d
    delete this.mediaStream
    this.mixingConfigList = []
    super.dispose()
  }
}
