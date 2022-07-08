import React, { useEffect, useRef } from 'react';
import { KeylockNumberSet } from './KeylockNumberSet';
import { oneNumberHeight } from './oneNumberHeight';

export const Keylock = (props: {
  selectedNumber: string;
  readonly?: boolean;
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
