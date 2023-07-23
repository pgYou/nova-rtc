import { IVideoMixingParams, WebRtc, WebVisionSourceType } from 'nova-rtc';
import { useEffect, useRef } from 'react';
const src =
  'https://picx.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpg?source=172ae18b';
async function addDefaultCamera(webRtc: WebRtc) {
  const cameras = await webRtc.getCameraList();

  const imgSize = await webRtc.measureImage(src);
  let width = 800;

  const text = '😎NOVA-RTC';
  const textHeight = 250;
  const { aspectRatio: textAspectRatio } = webRtc.measureText(text);

  // const display = await webRtc.getDisplayMediaStream();

  webRtc.updateSourceList([]);
}

function useNovaRtc(config: IVideoMixingParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webRtcRef = useRef<WebRtc>();
  useEffect(() => {
    webRtcRef.current = new WebRtc();
    // @ts-ignore for test
    window.webRtc = webRtcRef.current;
  }, []);
  useEffect(() => {
    if (containerRef.current && webRtcRef.current) {
      webRtcRef.current.initLocalView(containerRef.current);
      webRtcRef.current.init(config);
    }
  }, [containerRef]);

  return { containerRef, webRtcRef };
}
export default useNovaRtc;
