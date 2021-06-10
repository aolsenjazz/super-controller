/* eslint-disable react/no-array-index-key */

import React from 'react';

import KeyBlackIcon from './KeyBlackIcon';

const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  active: boolean;
  width: number;
  height: number;
  left: number;
  bottom: number;
  deviceWidth: number;
  deviceHeight: number;
};

export default function Keyboard(props: PropTypes) {
  const {
    active,
    height,
    width,
    left,
    bottom,
    deviceWidth,
    deviceHeight,
  } = props;

  const style = {
    width: `${(width / deviceWidth) * 100}%`,
    height: `${(height / deviceHeight) * 100}%`,
    left: `${(left / deviceWidth) * 100 - 1}%`,
    bottom: `${(bottom / deviceHeight) * 100}%`,
  };

  return (
    <div id="keyboard-container" style={style} className="Input">
      <div className={`octave ${active ? 'active' : ''}`}>
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        <div className={`key key-white ${active ? 'active' : ''}`} />
        {FUNDAMENTALS_BLACK.map((fundamental) => (
          <KeyBlackIcon
            fundamental={fundamental}
            key={fundamental}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
