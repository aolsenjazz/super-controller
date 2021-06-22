import React, { useEffect, useState } from 'react';
import { MidiMessage, MidiValue } from 'midi-message-parser';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';

import { Color } from '../../driver-types';
import { SupportedDeviceConfig, InputConfig } from '../../hardware-config';

import { VirtualInput, VirtualInputGrid } from '../../virtual-devices';

type ElementPropTypes = {
  input: VirtualInput;
  config: InputConfig;
  configured: boolean;
  width: string;
  height: string;
  focus: boolean;
  onClick: (event: React.MouseEvent, id: string) => void;
};

function Element(props: ElementPropTypes) {
  const { input, config, configured, width, height, onClick, focus } = props;
  const [color, setColor] = useState<Color | undefined>(config.currentColor);
  const enabled = configured && input.overrideable;

  const defaultVal = config.eventType === 'pitchbend' ? 64 : 0;
  const [value, setValue] = useState(defaultVal);

  // Whenever a light config is change, change accordingly
  useEffect(() => {
    setColor(config.currentColor);
  }, [config]);

  // Whenever input is received, change the virtual layout accordingly
  useEffect(() => {
    const cb = (
      _e: IpcRendererEvent,
      toDevice: MidiValue[] | null,
      toPropagate: MidiValue[] | null
    ) => {
      if (toDevice) {
        const mm = new MidiMessage(toDevice, 0);
        config.devicePropagator.lastPropagated = mm;
        setColor(config.currentColor);
      }

      if (toPropagate) setValue(toPropagate[2]);
    };

    ipcRenderer.on(input.id, cb);
    return () => {
      ipcRenderer.removeListener(input.id, cb);
    };
  }, [input, config]);

  let elem;
  if (input.type === 'pad') {
    elem = (
      <Pad
        id={input.id}
        shape={input.shape}
        width={width}
        height={height}
        onClick={(e) => onClick(e, input.id)}
        color={color}
        enabled={enabled}
        focus={focus}
      />
    );
  } else if (input.type === 'knob') {
    elem = (
      <Knob
        size={width}
        min={0}
        max={127}
        degrees={270}
        value={value}
        onClick={(e) => onClick(e, input.id)}
        enabled={enabled}
        focus={focus}
        shape={input.shape}
      />
    );
  } else {
    elem = (
      <WheelLayout
        max={127}
        value={value}
        width={width}
        handleWidth={`${(input.handleWidth! / input.width) * 100}%`}
        handleHeight={`${(input.handleHeight! / input.height) * 100}%`}
        height={height}
        enabled={enabled}
        focus={focus}
        onClick={(e) => onClick(e, input.id)}
      />
    );
  }

  return elem;
}

type PropTypes = {
  inputGrid: VirtualInputGrid;
  deviceWidth: number;
  deviceHeight: number;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, ids: string[]) => void;
  configured: boolean;
  selectedInputs: string[];
};

const InputGridLayout = (props: PropTypes) => {
  const {
    inputGrid,
    deviceWidth,
    onClick,
    configured,
    selectedInputs,
    deviceConfig,
    deviceHeight,
  } = props;

  const style = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {inputGrid.inputs.map((input) => {
        const inputConfig = deviceConfig.getInput(input.id);

        return (
          <div
            className="input-container"
            key={input.id}
            style={{
              width: `calc(100% / ${inputGrid.nCols})`,
              height: `calc(100% / ${inputGrid.nRows})`,
            }}
          >
            <Element
              width={`${
                (input.width / (inputGrid.width / inputGrid.nCols)) * 100
              }%`}
              height={`${
                (input.height / (inputGrid.height / inputGrid.nRows)) * 100
              }%`}
              input={input}
              config={inputConfig!}
              configured={configured}
              onClick={(_e, id: string) => {
                if (input.overrideable && configured) onClick(_e, [id]);
              }}
              focus={selectedInputs.includes(input.id) && configured}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputGridLayout;
