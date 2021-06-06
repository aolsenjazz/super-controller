/* eslint-disable react/no-array-index-key */

import React from 'react';

import { InputGridStyle } from '../../driver-types';
import KeyWhite from './KeyWhite';
import KeyBlack from './KeyBlack';

const FUNDAMENTALS_WHITE = [0, 2, 4, 5, 7, 9, 11];
const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  style: InputGridStyle;
  nOctaves: number;
};

export default function Keyboard(props: PropTypes) {
  const { nOctaves, style } = props;

  return (
    <div id="keyboard-container" style={style} className="input-grid">
      {[...Array(nOctaves)].map((_x, octave) => (
        <div
          key={octave}
          className="octave"
          style={{
            width: `calc(${100 / nOctaves}% - ${
              100 / nOctaves / 7 / nOctaves
            }%)`,
          }}
        >
          {FUNDAMENTALS_WHITE.map((fundamental) => (
            <KeyWhite key={fundamental * octave + fundamental} />
          ))}

          {FUNDAMENTALS_BLACK.map((fundamental) => (
            <KeyBlack
              key={fundamental * octave + fundamental}
              fundamental={fundamental}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
