import {
  IMixingConfig,
  IVideoMixingParams,
  SourceConfigType,
} from './core/interface';
import {
  WebCameraVideoSource,
  WebDisplayVideoSource,
  MixingVideoSource,
  WebImageSource,
  TextSource,
} from './core/source';

export enum WebVisionSourceType {
  webcamera = 'webcamera',
  webdisplay = 'webdisplay',
  webimage = 'webimage',
  text = 'text',
}

const SouceContructorProvider = {
  [WebVisionSourceType.webcamera]: WebCameraVideoSource,
  [WebVisionSourceType.webimage]: WebImageSource,
  [WebVisionSourceType.text]: TextSource,
  [WebVisionSourceType.webdisplay]: WebDisplayVideoSource,
};

export class WebRtc {
  private mixingVideoSource: MixingVideoSource;

  private sourceList: SourceConfigType[];

  private mixingConfigMap: Map<string, IMixingConfig>;
  constructor() {
    this.mixingVideoSource = new MixingVideoSource();
    this.sourceList = [];
    this.mixingConfigMap = new Map<string, IMixingConfig>();
  }

  init(config: IVideoMixingParams) {
    this.mixingVideoSource.init(config);
    WebCameraVideoSource.requestUserMediaPermission();
  }

  initLocalView(container: HTMLDivElement): void {
    container.innerHTML = '';
    container.appendChild(this.mixingVideoSource.visionMedia);
  }
  getCameraList() {
    return WebCameraVideoSource.getCameraList();
  }

  measureImage(src: string) {
    return WebImageSource.measureImage(src);
  }

  measureText(text: string, fonStyle?: string) {
    return TextSource.measureText(text, fonStyle);
  }

  getDisplayMediaStream() {
    return WebDisplayVideoSource.getDisplayMediaStream();
  }

  updateSourceList(sourceList: SourceConfigType[]) {
    const newMixingConfigMap = new Map<string, IMixingConfig>();

    sourceList.forEach((item) => {
      // 同一个设备，切换了配置参数，需要重新启动
      const key = `${item.deviceId}-${JSON.stringify(item.constraint)}`;
      if (this.mixingConfigMap.has(key)) {
        newMixingConfigMap.set(key, {
          ...this.mixingConfigMap.get(key)!,
          ...item,
        });
        this.mixingConfigMap.delete(key);
      } else {
        const source = this.createMideaSource(item);
        newMixingConfigMap.set(key, { videoSource: source, ...item });
      }
    });

    this.mixingConfigMap.forEach((item) => {
      item.videoSource.dispose();
    });

    this.mixingConfigMap.clear();
    this.mixingConfigMap = newMixingConfigMap;
    this.sourceList = sourceList;

    let mixingConfig = Array.from(newMixingConfigMap).map((item) => item[1]);
    // console.log(mixingConfig);
    this.mixingVideoSource.updateMixingConfig(mixingConfig);
  }

  createMideaSource(sourceConfig: SourceConfigType) {
    const constraint = {
      ...sourceConfig.constraint,
    };
    if (
      sourceConfig.sourceType === WebVisionSourceType.text &&
      constraint.params
    ) {
      constraint.params.fontSize =
        constraint.params.fontSize || sourceConfig.rect.height;
    }
    return SouceContructorProvider[sourceConfig.sourceType].createAndInit?.(
      sourceConfig.constraint
    );
  }
}
