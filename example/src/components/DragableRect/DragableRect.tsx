import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ResizeDot from './ResizeDot';
import { throttle } from 'lodash';
import './style.less';
import useAutoRef from '../../useAutoRef';
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export interface IProps {
  rect: Rect;
  active?: boolean;
  onLayout?: (rect: Rect) => void;
  onClick?: () => void;
  scale?: number;
  order?: number;
}
//  dx 某个点鼠标移动1个单元对于x这个值的 计算单位
const dotOptions = [
  { clsn: 'left-top', dx: 1, dy: 1, dw: -1, dh: -1 },
  { clsn: 'right-top', dx: 0, dy: 1, dw: -1, dh: -1 },
  { clsn: 'left-bottom', dx: -1, dy: 0, dw: 1, dh: 1 },
  { clsn: 'right-bottom', dx: 0, dy: 0, dw: 1, dh: 1 },
];
export default function DragableRect(props: IProps) {
  const { rect, onLayout, active, scale = 1, order = 1 } = props;
  const onLayoutRef = useAutoRef(onLayout);
  const rectRef = useAutoRef(rect);

  function handleClick() {
    props.onClick?.();
  }
  const isPressing = useRef(false);
  const startPos = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const fn = throttle(
      (e: any) => {
        if (!isPressing.current) return;
        const deltX = (e.clientX - startPos.current.x) / scale;
        const deltY = (e.clientY - startPos.current.y) / scale;
        const newRect = {
          ...rectRef.current,
          x: deltX + rectRef.current.x,
          y: deltY + rectRef.current.y,
        };
        startPos.current.x = e.clientX;
        startPos.current.y = e.clientY;

        onLayoutRef.current?.(newRect);
      },
      50,
      { leading: false }
    );
    document.body.addEventListener('mousemove', fn, true);
    return () => document.body.removeEventListener('mousemove', fn, true);
  }, []);

  const stopPressing = useCallback(() => {
    isPressing.current = false;
    startPos.current = {
      x: -1,
      y: -1,
    };
  }, []);
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (
        (e.nativeEvent.target as any)?.classList.contains('dragable-rect-dot')
      ) {
        return;
      }
      isPressing.current = true;
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
      };
      document.body.addEventListener('mouseup', stopPressing, {
        capture: true,
        once: true,
      });
    },
    []
  );
  const onDotMove = (dotOption: any, deltaX: number, deltaY: number) => {
    if (!rectRef.current || !onLayoutRef.current) return;

    const { x, y, width, height } = rectRef.current;
    const { dx, dy, dw, dh } = dotOption;

    // 宽高等比缩放 + 考虑容器缩放比例
    const aspectRaido = width / height;
    deltaY = deltaY / scale;
    deltaX = aspectRaido * deltaY;

    onLayoutRef.current({
      x: x + dx * deltaX,
      y: y + dy * deltaY,
      width: width + dw * deltaX,
      height: height + dh * deltaY,
    });
  };
  const dotSizeStyle = useMemo(() => {
    return {
      height: `${8 / scale}px`,
      width: `${8 / scale}px`,
    };
  }, [scale]);
  return (
    <div
      className="dragable-rect"
      data-active={!!active}
      style={{
        top: rect.y,
        left: rect.x,
        width: rect.width,
        height: rect.height,
        zIndex: order,
      }}
      onClick={handleClick}
      onMouseDown={onMouseDown}
    >
      {dotOptions.map((item) => (
        <ResizeDot
          onMove={(x, y) => onDotMove(item, x, y)}
          key={item.clsn}
          className={item.clsn}
          style={dotSizeStyle}
        />
      ))}
    </div>
  );
}
