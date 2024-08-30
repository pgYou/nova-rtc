import { loadShader } from '../../../utils/webgl';
import { IMixingConfig, IVideoMixingParams } from '../../interface';
import { BaseCanvasSource } from '../BaseSource';
import { vertexShaderSource, yuvShaderSource } from './shaders'
export default class GLMixingVideoSource extends BaseCanvasSource {


  private videoMixingParams?: IVideoMixingParams;

  private mixingConfigList: Array<IMixingConfig>;

  private glContext: WebGLRenderingContext

  private glProgram: WebGLProgram | null = null

  private drawing: boolean = false

  constructor() {
    super();
    this.glContext = this.canvas.getContext('webgl')!
    this.mixingConfigList = []

  }

  init(params: IVideoMixingParams) {
    const { frameRate = 24, backgroundColor = '#000', width, height } = params;
    this.videoMixingParams = { frameRate, backgroundColor, width, height };
    this.canvas.height = height;
    this.canvas.width = width;
    this.canvas.style.height = height + 'px';
    this.canvas.style.width = width + 'px';

    this.initGl()
  }

  private initGl() {
    const program = this.glContext.createProgram()
    if (!program) throw new Error('program create fail')

    const vertexShader = loadShader(this.glContext, vertexShaderSource, this.glContext.VERTEX_SHADER)
    const fragmentShader = loadShader(this.glContext, vertexShaderSource, this.glContext.FRAGMENT_SHADER)

    this.glContext.attachShader(program, vertexShader)
    this.glContext.attachShader(program, fragmentShader)

    this.glContext.linkProgram(program)
    this.glContext.useProgram(program)
    this.glProgram = program

  }

  updateMixingConfig(config: Array<IMixingConfig>) {
    this.mixingConfigList = config;
  }

  async requestFrame() {
    if (this.drawing) return;
    // console.log('requestFrame');

    this.drawing = true;

    const { backgroundColor } = this.videoMixingParams || {};
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context2d.fillStyle = backgroundColor || '';
    this.context2d.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const list = this.mixingConfigList.sort((a, b) => a.order - b.order);
    for (let i = 0; i < list.length; i++) {
      const sourceConfig = list[i];
      await sourceConfig.videoSource.requestFrame();

      try {
        this.renderSource(sourceConfig);
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    }
    this.drawing = false;

  }
  private renderSource(sourceConfig: IMixingConfig) {

  }
}
