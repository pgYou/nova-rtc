import useNovaRtc from './useNovaRtc'
import './App.css'
import { useSourceManager } from './useSourceManager'
import useViewSize from './useViewSize'

import DragableRect from './components/DragableRect/DragableRect'
import { useState, useCallback } from 'react'

function App() {
  const { scale, viewSize, outputSize, frameRate } = useViewSize()
  const { containerRef, webRtcRef } = useNovaRtc({
    width: outputSize.width,
    height: outputSize.height,
    frameRate,
  })
  const { updateSource, addSource, removeSource, list } =
    useSourceManager(webRtcRef)
  const [activeRect, setActiveRect] = useState('')
  const play = useCallback(() => {
    const canvas = document.querySelector(
      '.rtc-view-wrapper canvas'
    ) as HTMLCanvasElement
    const video = document.querySelector('#result-video') as HTMLVideoElement
    const mediaSteam = canvas.captureStream(24)
    video.srcObject = mediaSteam
    video.play()
  }, [])
  const capture = useCallback(() => {
    const canvas = document.querySelector(
      '.rtc-view-wrapper canvas'
    ) as HTMLCanvasElement

    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'canvas_image.png'
    // 模拟点击链接来触发下载
    link.click()
  }, [])
  return (
    <div className="App">
      <h2 className="title">操作&预览画布(canvas元素)</h2>
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
                setActiveRect(item.deviceId)
              }}
              onLayout={(rect) => {
                updateSource({
                  ...item,
                  rect,
                })
              }}
              scale={scale}
              order={item.order}
            />
          ))}
          <div ref={containerRef}> </div>
        </div>
      </div>
      <h2 className="title">
        混流结果（video元素）
        <button className="opt" onClick={play}>
          播放混流视频
        </button>
        <button className="opt" onClick={capture}>
          截图
        </button>
      </h2>
      <video
        id="result-video"
        controls
        style={{
          width: viewSize.width,
          height: viewSize.height,
          display: 'block',
          margin: 'auto',
          backgroundColor: 'black',
        }}
        autoPlay
      ></video>
    </div>
  )
}

export default App
