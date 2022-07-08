import React, { useEffect, useRef } from 'react';
import { KeylockNumberSet } from './KeylockNumberSet';
import { oneNumberHeight } from './oneNumberHeight';

import styled from 'styled-components';
const ContainerDiv = styled.div`
  display: inline-block;
  border-top: 8px #e9e9e9 solid;
  border-bottom: 8px #e9e9e9 solid;
  border-left: 16px #e9e9e9 solid;
  border-right: 16px #e9e9e9 solid;
  font-family: 'Droid Sans Mono', 'Courier New', monospace;
`;

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
      <ContainerDiv ref={containerRef}>
        <div
          style={{
            paddingTop: '8px',
            paddingBottom: '8px',
            display: 'flex',
            height: `${oneNumberHeight(props.size ?? 'medium')}px`,
            overflow: 'hidden',
            position: 'relative',
            color: props.readonly ? `#AAAAAA` : 'inherit',
          }}
        >
          {props.selectedNumber.split('').map((n, i) => (
            <KeylockNumberSet
              size={props.size ?? 'medium'}
              readonly={props.readonly ?? false}
              key={i}
              position={i + 1}
              selectedNumber={parseInt(n)}
              onNumberChange={handleNumberChange(i)}
            />
          ))}
        </div>
      </ContainerDiv>
    </>
  );
};
