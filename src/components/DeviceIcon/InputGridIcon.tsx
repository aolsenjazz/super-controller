import React from 'react';

import { InputGridDriver } from '../../driver-types';

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
  active: boolean;
};

const InputGridIcon = (props: PropTypes) => {
  const { inputGrid, deviceWidth, deviceHeight, active } = props;

  const igStyle = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={igStyle}>
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
                width: `${
                  (input.width / (inputGrid.width / inputGrid.nCols)) * 100
                }%`,
                height: `${
                  (input.height / (inputGrid.height / inputGrid.nRows)) * 100
                }%`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputGridIcon;
