import React, { useEffect, useRef } from 'react';
import { oneNumberHeightCss } from './oneNumberHeight';

export const KeylockNumber = (props: {
  position: number;
  size: 'small' | 'medium';
  number: number;
  readonly: boolean;
  startMove: () => void;
  endMove: () => void;
  moveY: (deltaY: number) => void;
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const current = containerRef.current as any;
      current.isGrabbing = false;
      current.cursorY = 0;

      const mouseDownHandler = (evt: any) => {
        if (!props.readonly) {
          current.isGrabbing = true;
          current.cursorY = evt.clientY ?? evt.touches[0].clientY;
          props.startMove();
        }
      };
      current.addEventListener('mousedown', mouseDownHandler);
      current.addEventListener('touchstart', mouseDownHandler);

      const mouseUpHandler = () => {
        if (current.isGrabbing) {
          current.isGrabbing = false;
          props.endMove();
        }
      };
      window.addEventListener('mouseup', mouseUpHandler);
      window.addEventListener('touchend', mouseUpHandler);

      const mouseMoveHandler = (evt: any) => {
        if (current.isGrabbing) {
          props.moveY(
            current.cursorY - (evt.clientY ?? evt.touches[0].clientY ?? 0),
          );
        }
      };
      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('touchmove', mouseMoveHandler);

      return () => {
        current.removeEventListener('mousedown', mouseDownHandler);
        current.removeEventListener('touchstart', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('touchend', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('touchmove', mouseMoveHandler);
      };
    }
  }, [containerRef.current, props.readonly]);
  return (
    <div
      ref={containerRef}
      style={{
        cursor: props.readonly ? 'default' : 'grab',
        width: props.size == 'small' ? '40px' : '80px',
        minHeight: oneNumberHeightCss(props.size),
        maxHeight: oneNumberHeightCss(props.size),
        textAlign: 'center',
        userSelect: 'none',
        borderBottom: '1px #DDD solid',
        borderTop: '1px #DDD solid',
      }}
    >
      <label
        style={{
          cursor: props.readonly ? 'default' : 'grab',
        }}
      >
        {props.number}
      </label>
    </div>
  );
};
