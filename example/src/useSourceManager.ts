import { useEffect, useState } from 'react';
import { SourceConfigType, WebRtc, WebVisionSourceType } from 'nova-rtc';
const src =
  'https://picx.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1440w.jpg?source=172ae18b';
export function useSourceManager(
  webRtcRef: React.MutableRefObject<WebRtc | undefined>
) {
  const [list, setList] = useState<SourceConfigType[]>([]);

  useEffect(() => {
    if (!webRtcRef.current) return;
    const webRtc = webRtcRef.current;
    async function init() {
      const cameras = await webRtc.getCameraList();

      const imgSize = await webRtc.measureImage(src);
      let width = 800;

      // const display = await webRtc.getDisplayMediaStream();

      const text = '😎NOVA-RTC';
      const textHeight = 250;
      const { aspectRatio: textAspectRatio } = webRtc.measureText(text);
      setList([
        {
          deviceId: cameras[0].deviceId,
          sourceType: WebVisionSourceType.webcamera,
          constraint: {
            aspectRatio: 1920 / 1080,
          },
          order: 10,
          // rotate: Math.PI / 2,
          rect: {
            x: 0,
            y: 0,
            width: 1920 / 2,
            height: 1080 / 2,
          },
        },
        {
          deviceId: 'image',
          sourceType: WebVisionSourceType.webimage,
          constraint: {
            src,
          },
          order: 1,
          rect: {
            x: 1920 / 2 + 50,
            y: 0,
            width,
            height: width / imgSize.aspectRatio,
          },
        },
        // {
        //   deviceId: 'display1',
        //   sourceType: WebVisionSourceType.webdisplay,
        //   constraint: {
        //     mediaStream: display.mediaStream,
        //   },
        //   order: 3,
        //   rect: {
        //     x: 0,
        //     y: 1080 / 2,
        //     width: width,
        //     height: width / display.size.aspectRatio,
        //   },
        // },
        {
          deviceId: text,
          sourceType: WebVisionSourceType.text,
          constraint: {
            text,
            params: {
              fillStyle: '#ff0000',
            },
          },
          order: 3,
          rect: {
            x: 40,
            y: 1080 / 2 + 50,
            width: textHeight * textAspectRatio,
            height: textHeight,
          },
        },
      ]);
    }
    init();
  }, [webRtcRef.current]);

  useEffect(() => {
    if (webRtcRef.current) {
      webRtcRef.current.updateSourceList(list);
    }
  }, [list]);

  function updateSource(source: SourceConfigType) {
    const idx = list.findIndex((item) => item.deviceId === source.deviceId);
    if (idx > -1) {
      list[idx] = source;
    }
    setList([...list]);
  }
  function addSource(source: SourceConfigType) {
    setList([...list, source]);
  }
  function removeSource(id: string) {
    const idx = list.findIndex((item) => item.deviceId === id);
    if (idx >= 0) {
      const newList = [...list];
      newList.splice(idx, 1);
      setList(newList);
    }
  }
  return { updateSource, addSource, removeSource, list };
}
