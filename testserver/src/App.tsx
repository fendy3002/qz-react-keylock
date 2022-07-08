import React, { useState } from 'react';

import './App.css';
import { Keylock } from './lib';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomNumber(num: number) {
  let result = '';
  for (let i = 0; i < num; i++) {
    result += getRandomInt(0, 9).toString();
  }
  return result;
}

function App() {
  const [selectedNumber, setSelectedNumber] = useState(getRandomNumber(6)); //943178
  return (
    <>
      <div style={{ marginTop: '100px' }}></div>
      <div style={{ marginBottom: '8px' }}>
        <button onClick={() => setSelectedNumber(getRandomNumber(6))}>
          Shuffle
        </button>
      </div>
      <div style={{}}>
        <Keylock
          selectedNumber={selectedNumber}
          readonly={selectedNumber == '000000'}
          onChange={setSelectedNumber}
        />

        <Keylock
          size="small"
          selectedNumber={selectedNumber}
          readonly={selectedNumber == '000000'}
          onChange={setSelectedNumber}
        />
      </div>

      <div style={{ marginTop: '400px' }}></div>
    </>
  );
}

export default App;
