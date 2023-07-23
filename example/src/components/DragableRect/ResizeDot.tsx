import { throttle } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import useAutoRef from '../../useAutoRef';

export interface IProps {
  style: React.HTMLAttributes<HTMLDivElement>['style'];
  className: React.HTMLAttributes<HTMLDivElement>['className'];
  onMove?: (deltaX: number, deltaY: number) => void;
}

export default function ResizeDot(props: IProps) {
  const { style, className, onMove } = props;
  const onMoveRef = useAutoRef(onMove);
  const isPressing = useRef(false);
  const startPos = useRef({ x: -1, y: -1 });
  useEffect(() => {
    const fn = throttle(
      (e: MouseEvent) => {
        if (!isPressing.current) return;
        const deltX = e.clientX - startPos.current.x;
        const deltY = e.clientY - startPos.current.y;
        e.stopImmediatePropagation();
        startPos.current.x = e.clientX;
        startPos.current.y = e.clientY;
        onMoveRef.current?.(deltX, deltY);
      },
      100,
      { trailing: true }
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
  return (
    <div
      className={'dragable-rect-dot ' + className}
      style={style}
      onMouseDown={onMouseDown}
    />
  );
}
