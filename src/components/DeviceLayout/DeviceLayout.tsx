import React from 'react';
import AspectRatio from 'react-aspect-ratio';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';
import XYGridLayout from './XYGridLayout';

import { SupportedDeviceConfig } from '../../hardware-config';
import { VirtualDevice } from '../../virtual-devices';

type PropTypes = {
  device: VirtualDevice;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
  configured: boolean;
};

/**
 * @callback onClick
 * @param { React.MouseEvent } event Click event
 * @param { string[] } ids List of selected ids
 */

/**
 * Root container for virtual device layouts. `DeviceLayout`, graphically, covers all
 * of the area contained in and including the outline of the device.
 *
 * @param { object } props Component props
 * @param { VirtualDevice } props.device Containing driver and layout info for the device
 * @param { SupportedDeviceConfig } props.deviceConfig Configuration for the device
 * @param { onClick } props.onClick Click listener for input. used to set selected inputs
 * @param { string[] } props.selectedInputs Currently-selected input IDs
 * @param { boolean } props.configured Is the current device configured?
 */
export default function DeviceLayout(props: PropTypes) {
  const { device, onClick, selectedInputs, configured, deviceConfig } = props;

  return (
    <AspectRatio
      ratio={device.aspectRatio}
      style={{ ...device.style }}
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
            enabled={device.keyboard.enabled}
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
