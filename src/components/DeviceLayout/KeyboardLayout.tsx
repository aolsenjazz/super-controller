/* eslint-disable react/no-array-index-key */

import React from 'react';

import KeyBlack from './KeyBlack';

const FUNDAMENTALS_WHITE = [0, 2, 4, 5, 7, 9, 11];
const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  nOctaves: number;
  width: number;
  height: number;
  left: number;
  bottom: number;
  deviceWidth: number;
  deviceHeight: number;
};

/**
 * Graphical representation of a keyboard
 *
 * @param { object } props Component props
 * @param { number } props.nOctaves Number of octaves in keyboard
 * @param { number } props.width Width of keyboard (in inches)
 * @param { number } props.height Height of keyboard (in inches)
 * @param { number } props.left Distance from left edge of device (in inches)
 * @param { number } props.bottom Distance from bottom edge of device (in inches)
 * @param { number } props.deviceWidth Width (in inches) of device
 * @param { number } props.deviceHeight Height (in inches) of device
 */
export default function Keyboard(props: PropTypes) {
  const {
    nOctaves,
    width,
    height,
    left,
    bottom,
    deviceWidth,
    deviceHeight,
  } = props;

  const style = {
    width: `${(width / deviceWidth) * 100}%`,
    height: `${(height / deviceHeight) * 100}%`,
    left: `${(left / deviceWidth) * 100}%`,
    bottom: `${(bottom / deviceHeight) * 100}%`,
  };

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
            <div className="key-white key" key={fundamental} />
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
