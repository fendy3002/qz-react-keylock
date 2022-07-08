import React, { useEffect, useRef, useState } from 'react';
import { KeylockNumber } from './KeylockNumber';
import { oneNumberHeight } from './oneNumberHeight';

const dynamicJS = require('dynamics.js');

const number = [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2];

const oneLoopHeight = (size: 'small' | 'medium') => oneNumberHeight(size) * 10;
const offsetNumber = 2;

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
