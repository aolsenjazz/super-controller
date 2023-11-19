import { useEffect, useState } from 'react';

import { getDriver } from '@shared/drivers';
import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';

import DeviceIcon from '../DeviceIcon';

const { deviceService } = window;

/**
 * Returns the css class depending on connection and configuration status
 *
 * @param connected Is the device connected?
 * @param configured Is the device added to the current project?
 * @returns A css class
 */
function cssClassFor(connected: boolean, configured: boolean) {
  if (connected) {
    return configured ? 'configured' : 'connected';
  }
  return 'disconnected';
}

/**
 * Returns a human-readable string containing the connection and configuration status
 *
 * @param connected Is the device connected?
 * @param configured Is the device added to the current project?
 * @returns A status string
 */
function statusFor(connected: boolean, configured: boolean) {
  return `${connected ? 'Connected' : 'Disconnected'}${
    configured ? ', Configured' : ''
  }`;
}

/**
 * Reformats an id into a more human-readable string
 *
 * @param id The id of the device/port
 * @param siblingIndex The nth time this device model is connected
 * @returns A prettier id
 */
function reformatId(id: string, siblingIndex: number) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  const deviceName = id.substring(0, lastSpaceIdx);

  return siblingIndex === 0 ? deviceName : `${deviceName} (${siblingIndex})`;
}

type PropTypes = {
  deviceId: string;
  selected: boolean;
  onClick: () => void;
};

export default function DeviceListItem(props: PropTypes) {
  const { deviceId, selected, onClick } = props;
  const [descriptor, setDescriptor] = useState<DeviceDescriptor>();

  useEffect(() => {
    const cb = (desc: DeviceDescriptor) => {
      setDescriptor(desc);
    };

    const off = deviceService.onDeviceChange(deviceId, cb);
    deviceService.requestDeviceDescriptor(deviceId);

    return () => off();
  }, [deviceId]);

  if (descriptor === undefined) return null;

  return (
    <div className={`device-list-item ${selected ? 'active' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon driver={getDriver(deviceId)} active={selected} />
      </div>
      <div
        className="device-list-item-label"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
      >
        <h2>{descriptor.nickname || descriptor.name}</h2>
        <p className="id">{reformatId(deviceId, descriptor.siblingIdx)}</p>
        <div
          className={`connection-color ${cssClassFor(
            descriptor.connected,
            descriptor.configured
          )}`}
        />
        <p className="connection-status">
          {statusFor(descriptor.connected, descriptor.configured)}
        </p>
      </div>
    </div>
  );
}
