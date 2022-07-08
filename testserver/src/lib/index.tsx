import React, { useEffect, useRef, useState } from 'react';

const dynamicJS = require('dynamics.js');

const number = [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2];

const oneNumberHeight = (size: 'small' | 'medium') =>
  size == 'small' ? 49 : 94;
const oneLoopHeight = (size: 'small' | 'medium') => oneNumberHeight(size) * 10;
const offsetNumber = 2;

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
export const KeylockNumberSet = (props: {
  position: number;
  size: 'small' | 'medium';
  readonly: boolean;
  selectedNumber: number;
  onNumberChange: (number: number) => void;
}) => {
  const containerRef = useRef(null);
  const startMove = () => {
    const current = containerRef.current as any;
    current.startTop = parseInt(current.style.top.replace('px', ''));
  };
  const endMove = () => {
    const current = containerRef.current as any;
    const currentTop = parseInt(current.style.top.replace('px', ''));
    let currentlySelectedNumber =
      (10 - offsetNumber + Math.abs(currentTop) / oneNumberHeight(props.size)) %
      10;
    if (currentlySelectedNumber - Math.floor(currentlySelectedNumber) > 0.5) {
      currentlySelectedNumber += 1;
      currentlySelectedNumber = currentlySelectedNumber % 10;
    }
    currentlySelectedNumber = Math.floor(currentlySelectedNumber);
    current.style.top = `-${
      (offsetNumber + currentlySelectedNumber) * oneNumberHeight(props.size)
    }px`;
    props.onNumberChange(Math.abs(currentlySelectedNumber));
  };
  const moveY = (deltaY: number) => {
    const current = containerRef.current as any;
    let topAfterMove = (current.startTop - deltaY) % oneLoopHeight(props.size);
    if (topAfterMove > 0) {
      topAfterMove -= oneLoopHeight(props.size);
    }
    current.style.top = `${topAfterMove}px`;
  };
  useEffect(() => {
    if (containerRef.current) {
      const current = containerRef.current as any;
      const topValue =
        (offsetNumber + props.selectedNumber) * oneNumberHeight(props.size);

      if (current.selectedNumber != props.selectedNumber) {
        dynamicJS.animate(
          current,
          {
            top: -topValue,
          },
          {
            type: dynamicJS.spring,
            frequency: 200,
            friction: 200,
            duration: 1500,
          },
        );
      }
      current.selectedNumber = props.selectedNumber;
    }
  }, [containerRef.current, props.selectedNumber]);
  console.log(props.size);
  return (
    <div
      style={{
        width: props.size == 'small' ? '40px' : '80px',
        fontSize: props.size == 'small' ? '40px' : '80px',
        position: 'relative',
        marginRight: '2px',
        marginLeft: '2px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
        }}
      >
        {number.map((n, i) => (
          <KeylockNumber
            size={props.size}
            readonly={props.readonly}
            key={`${props.position}.${i}`}
            position={props.position}
            number={n}
            startMove={startMove}
            endMove={endMove}
            moveY={moveY}
          />
        ))}
      </div>
    </div>
  );
};
export const Keylock = (props: {
  selectedNumber: string;
  readonly: boolean;
  onChange: (newNumber: string) => void;
  size?: 'small' | 'medium';
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).selectedNumber = props.selectedNumber;
    }
  }, [containerRef.current, props.selectedNumber]);

  const handleNumberChange = (index: number) => (number: number) => {
    const current = containerRef.current as any;
    const lastSelectedNumber = current.selectedNumber;
    const newSelectedNumber = [
      ...lastSelectedNumber.split('').slice(0, index),
      number.toString(),
      ...lastSelectedNumber.split('').slice(index + 1),
    ].join('');

    current.selectedNumber = newSelectedNumber;
    props.onChange(newSelectedNumber);
  };
  return (
    <>
      <div
        style={{
          display: 'inline-block',
          borderTop: '8px #E9E9E9 solid',
          borderBottom: '8px #E9E9E9 solid',
          borderLeft: '16px #E9E9E9 solid',
          borderRight: '16px #E9E9E9 solid',
        }}
        ref={containerRef}
      >
        <div
          style={{
            paddingTop: '8px',
            paddingBottom: '8px',
            display: 'flex',
            fontFamily: 'Courier New',
            height: `${oneNumberHeight(props.size ?? 'medium')}px`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {props.selectedNumber.split('').map((n, i) => (
            <KeylockNumberSet
              size={props.size ?? 'medium'}
              readonly={props.readonly}
              key={i}
              position={i + 1}
              selectedNumber={parseInt(n)}
              onNumberChange={handleNumberChange(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
