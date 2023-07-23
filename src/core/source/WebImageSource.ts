import { getImageSize } from '../../utils/image';
import { ISourSize } from '../interface';
import { BaseCanvasSource } from './BaseSource';

export type WebImageSourceConstraintType = {
  src?: string;
};
export default class WebImageSource extends BaseCanvasSource {
  image: HTMLImageElement;
  size?: ISourSize;
  constructor(src?: string) {
    super();
    this.image = document.createElement('img');
    if (src) {
      this.setImageSrc(src);
    }
  }

  async requestFrame() {
    this.context2d?.drawImage(
      this.image,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  setImageSrc(src: string) {
    this.image.src = src;
    getImageSize(this.image).then((size) => {
      this.size = size;
      this.canvas.width = size.width;
      this.canvas.height = size.height;
    });
  }
  static measureImage(src: string): Promise<ISourSize> {
    var img = new Image();
    // 改变图片的src
    img.src = src;
    return getImageSize(img);
  }
  static createAndInit(constraint: WebImageSourceConstraintType) {
    const source = new WebImageSource(constraint.src || '');
    return source;
  }
}
