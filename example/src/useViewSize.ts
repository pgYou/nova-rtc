const outputSize = {
  width: 1920,
  height: 1080,
};
const viewWidth = 800;
export default function useViewSize() {
  const scale = viewWidth / outputSize.width;
  const viewHeight = outputSize.height * scale;

  return {
    scale,
    outputSize,
    viewSize: { height: viewHeight, width: viewWidth },
    frameRate: 24,
  };
}
