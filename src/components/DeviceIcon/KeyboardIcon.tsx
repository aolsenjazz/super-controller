/* eslint-disable react/no-array-index-key */

import React from 'react';

import KeyBlackIcon from './KeyBlackIcon';

import { InputGridStyle } from '../../driver-types';

const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  style: InputGridStyle;
  active: boolean;
};

export default function Keyboard(props: PropTypes) {
  const { style, active } = props;

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
