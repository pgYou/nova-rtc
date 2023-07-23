import { IFontStyle, ISourSize } from '../core/interface';

export function getTextSize(text: string, fonStyle?: string): ISourSize {
  if (!text) {
    return {
      aspectRatio: 1,
      width: 0,
      height: 0,
    };
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  if (fonStyle) {
    context.font = fonStyle;
  }

  const textMetrics = context.measureText(text);
  const result = context.font.match(/(?<fontSize>\d+)px/);
  let fontSize = Number(result?.groups?.fontSize);
  if (isNaN(fontSize)) {
    fontSize = 12;
  }

  return {
    aspectRatio: textMetrics.width / fontSize,
    width: textMetrics.width,
    height: fontSize,
  };
}

export function stringifyFontStyle(params: IFontStyle) {
  const { fontSize = 10, fontFamily = 'sans-serif', fontWeight } = params;
  const arr = [`${fontSize}px`, `${fontFamily}`];
  if (fontWeight) {
    arr.unshift(fontWeight);
  }
  return arr.join(' ');
}
