import { getTextSize, stringifyFontStyle } from '../../utils/text';
import { IDrawTextParams, ISourSize } from '../interface';
import { BaseCanvasSource } from './BaseSource';

export type TextSourceConstraintType = {
  text?: string;
  /**
   * 不指定fontSize 默认按rect.height渲染，填满矩形区域
   */
  params?: IDrawTextParams;
};

function getDefaultDrawTextParams(): IDrawTextParams {
  return {
    fontSize: 10,
    fontFamily:
      '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
    fontWeight: 'normal',
    fillStyle: '#fff',
  };
}
export default class TextSource extends BaseCanvasSource {
  protected text: string = '';
  protected size: ISourSize = {
    aspectRatio: 1,
    height: 0,
    width: 0,
  };
  protected params: IDrawTextParams = getDefaultDrawTextParams();

  constructor(text?: string, params?: IDrawTextParams) {
    super();
    this.setText(text || '', params);
    // document.body.append(this.canvas);
  }
  setText(text: string, params?: IDrawTextParams) {
    this.text = text;
    this.params = { ...this.params, ...params };

    const { aspectRatio, height, width } = getTextSize(
      text || '',
      stringifyFontStyle(this.params)
    );
    this.size = { aspectRatio, height, width };

    this.canvas.height = height;
    this.canvas.width = width;
    this.drawText();
  }

  drawText() {
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { fillStyle } = this.params;
    if (fillStyle) {
      this.context2d.fillStyle = fillStyle;
    }

    this.context2d.font = stringifyFontStyle(this.params);
    this.context2d.textBaseline = 'bottom';
    this.context2d.fillText(this.text, 0, this.canvas.height);
  }
  async requestFrame() {}

  static measureText(text: string, fonStyle?: string) {
    return getTextSize(text || '', fonStyle);
  }

  static createAndInit(constraint: TextSourceConstraintType) {
    return new TextSource(constraint.text || '', constraint.params);
  }
}
