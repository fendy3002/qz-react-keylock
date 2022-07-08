import React, { useEffect, useRef } from 'react';

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
          current.cursorY = evt.clientY;
          props.startMove();
        }
      };
      current.addEventListener('mousedown', mouseDownHandler);

      const mouseUpHandler = () => {
        if (current.isGrabbing) {
          current.isGrabbing = false;
          props.endMove();
        }
      };
      window.addEventListener('mouseup', mouseUpHandler);

      const mouseMoveHandler = (evt: any) => {
        if (current.isGrabbing) {
          props.moveY(current.cursorY - evt.clientY);
        }
      };
      window.addEventListener('mousemove', mouseMoveHandler);

      return () => {
        current.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
      };
    }
  }, [containerRef.current, props.readonly]);
  return (
    <div
      ref={containerRef}
      style={{
        cursor: 'grab',
        width: props.size == 'small' ? '40px' : '80px',
        textAlign: 'center',
        userSelect: 'none',
        borderBottom: '1px #DDD solid',
        borderTop: '1px #DDD solid',
      }}
    >
      <label
        style={{
          cursor: 'grab',
        }}
      >
        {props.number}
      </label>
    </div>
  );
};
