import React from 'react';

import { InputGridDriver } from '../../driver-types';

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  active: boolean;
};

const InputGridIcon = (props: PropTypes) => {
  const { inputGrid, deviceWidth, active } = props;

  return (
    <div className="input-grid" style={inputGrid.style}>
      {inputGrid.inputs.map((input) => {
        return (
          <div
            className="input-container"
            key={`${input.default.channel}${input.default.number}${input.default.eventType}`}
            style={{
              width: `calc(100% / ${inputGrid.nCols})`,
              height: `calc(100% / ${inputGrid.nRows})`,
            }}
          >
            <div
              className={`pad ${active ? 'active' : ''}`}
              style={{
                borderRadius: input.shape === 'circle' ? '100%' : '',
                width: Math.min(inputGrid.width * deviceWidth),
                height: Math.min(inputGrid.height * deviceWidth),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputGridIcon;
