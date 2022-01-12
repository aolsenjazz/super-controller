import { SupportedDeviceConfig } from '@shared/hardware-config';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';
import XYGridLayout from './XYGridLayout';

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
 * @param event Click event
 * @param ids List of selected ids
 */

/**
 * Root container for virtual device layouts. `DeviceLayout`, graphically, covers all
 * of the area contained in and including the outline of the device.
 *
 * @param props Component props
 * @param props.device Containing driver and layout info for the device
 * @param props.deviceConfig Configuration for the device
 * @param props.onClick Click listener for input. used to set selected inputs
 * @param props.selectedInputs Currently-selected input IDs
 * @param props.configured Is the current device configured?
 */
export default function DeviceLayout(props: PropTypes) {
  const { device, onClick, selectedInputs, configured, deviceConfig } = props;

  return (
    <div
      style={{
        aspectRatio: `${device.width}/${device.height}`,
        ...device.style,
      }}
      className={`device-layout ${configured ? 'configured' : ''}`}
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
              deviceConfig={deviceConfig}
            />
          );
        })}
      </div>
    </div>
  );
}
