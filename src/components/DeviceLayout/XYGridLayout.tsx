import React, { useEffect, useState } from 'react';
import { MidiValue } from 'midi-message-parser';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import XYLayout from './XYLayout';

import { SupportedDeviceConfig } from '../../hardware-config';

import { VirtualInputGrid } from '../../virtual-devices';

type PropTypes = {
  inputGrid: VirtualInputGrid;
  deviceWidth: number;
  deviceHeight: number;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, ids: string[]) => void;
  configured: boolean;
  selectedInputs: string[];
};

const XYGridLayout = (props: PropTypes) => {
  const {
    inputGrid,
    deviceWidth,
    onClick,
    configured,
    selectedInputs,
    deviceConfig,
    deviceHeight,
  } = props;

  const xInput = inputGrid.inputs[0];
  const yInput = inputGrid.inputs[1];

  const xConfig = deviceConfig.getInput(xInput.id);
  const yConfig = deviceConfig.getInput(yInput.id);

  const xValueDefault = xConfig?.eventType === 'pitchbend' ? 64 : 0;
  const yValueDefault = yConfig?.eventType === 'pitchbend' ? 64 : 0;
  const [xValue, setXValue] = useState(xValueDefault);
  const [yValue, setYValue] = useState(yValueDefault);

  const enabled = configured && xConfig?.overrideable === true;

  // Whenever input is received, change the virtual layout accordingly
  useEffect(() => {
    const xCb = (
      _e: IpcRendererEvent,
      _toDev: MidiValue[] | null,
      toProp: MidiValue[] | null
    ) => {
      if (toProp) {
        setXValue(toProp[2]);
      }
    };

    const yCb = (
      _e: IpcRendererEvent,
      _toDev: MidiValue[] | null,
      toProp: MidiValue[] | null
    ) => {
      if (toProp) {
        setYValue(toProp[2]);
      }
    };

    ipcRenderer.on(xInput.id, xCb);
    ipcRenderer.on(yInput.id, yCb);
    return () => {
      ipcRenderer.removeListener(xInput.id, xCb);
      ipcRenderer.removeListener(yInput.id, yCb);
    };
  }, [xInput, yInput]);

  const igStyle = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={igStyle}>
      <div
        className="input-container"
        key={xInput.id}
        style={{
          width: `calc(100% / ${inputGrid.nCols})`,
          height: `calc(100% / ${inputGrid.nRows})`,
        }}
      >
        <XYLayout
          width={`${(xInput.width / inputGrid.width) * 100}%`}
          height={`${(xInput.height / inputGrid.height) * 100}%`}
          handleWidth={`${(xInput.handleWidth! / xInput.width) * 100}%`}
          handleHeight={`${(xInput.handleHeight! / xInput.height) * 100}%`}
          xMax={127}
          yMax={127}
          xValue={xValue}
          yValue={yValue}
          enabled={enabled}
          shape={xInput.shape ? xInput.shape : 'rect'}
          onClick={(e) => {
            if (xConfig?.overrideable && configured) {
              onClick(e, [xInput.id, yInput.id]);
            }
          }}
          focus={selectedInputs.includes(xInput.id) && configured}
        />
      </div>
    </div>
  );
};

export default XYGridLayout;
