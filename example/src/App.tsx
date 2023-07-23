import useNovaRtc from './useNovaRtc';
import './App.css';
import { useSourceManager } from './useSourceManager';
import useViewSize from './useViewSize';

import DragableRect from './components/DragableRect/DragableRect';
import { useState } from 'react';

function App() {
  const { scale, viewSize, outputSize, frameRate } = useViewSize();
  const { containerRef, webRtcRef } = useNovaRtc({
    width: outputSize.width,
    height: outputSize.height,
    frameRate,
  });
  const { updateSource, addSource, removeSource, list } =
    useSourceManager(webRtcRef);
  const [activeRect, setActiveRect] = useState('');

  return (
    <div className="App">
      <div
        className="rtc-view-wrapper"
        style={{ width: viewSize.width, height: viewSize.height }}
      >
        <div
          className="rtc-view"
          style={{
            ...outputSize,
            transform: `scale(${scale.toFixed(3)})`,
          }}
        >
          {list?.map((item) => (
            <DragableRect
              key={item.deviceId}
              active={activeRect === item.deviceId}
              rect={item.rect}
              onClick={() => {
                setActiveRect(item.deviceId);
              }}
              onLayout={(rect) => {
                updateSource({
                  ...item,
                  rect,
                });
              }}
              scale={scale}
              order={item.order}
            />
          ))}
          <div ref={containerRef}> </div>
        </div>
      </div>
    </div>
  );
}

export default App;
