import React, { useRef, useState, useEffect } from 'react';
import AspectRatio from 'react-aspect-ratio';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';
import XYGridLayout from './XYGridLayout';

import { SupportedDeviceConfig } from '../../hardware-config';
import { VirtualDevice } from '../../virtual-devices';

import 'react-aspect-ratio/aspect-ratio.css';

type PropTypes = {
  device: VirtualDevice;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
  configured: boolean;
};

/**
 * Root container for virtual device layouts. `DeviceLayout`, graphically, covers all
 * of the area contained in and including the outline of the device.
 */
export default function DeviceLayout(props: PropTypes) {
  const { device, onClick, selectedInputs, configured, deviceConfig } = props;

  return (
    <AspectRatio
      ratio={device.aspectRatio}
      style={{ maxWidth: 'calc(100vh)', ...device.style }}
      className="device-layout"
    >
      <div id={device.name}>
        {device.keyboard ? (
          <Keyboard
            nOctaves={device.keyboard.nOctaves}
            width={device.keyboard.width}
            height={device.keyboard.height}
            left={device.keyboard.left}
            bottom={device.keyboard.bottom}
            deviceWidth={device.width}
            deviceHeight={device.height}
          />
        ) : null}

        {device.inputGrids.map((inputGrid) => {
          return inputGrid.isMultiInput ? (
            <XYGridLayout
              key={inputGrid.id}
              inputGrid={inputGrid}
              deviceWidth={device.width}
              deviceHeight={device.height}
              onClick={onClick}
              selectedInputs={selectedInputs}
              configured={configured}
              deviceConfig={deviceConfig}
            />
          ) : (
            <InputGridLayout
              key={inputGrid.id}
              inputGrid={inputGrid}
              deviceWidth={device.width}
              deviceHeight={device.height}
              onClick={onClick}
              selectedInputs={selectedInputs}
              configured={configured}
              deviceConfig={deviceConfig}
            />
          );
        })}
      </div>
    </AspectRatio>
  );
}
