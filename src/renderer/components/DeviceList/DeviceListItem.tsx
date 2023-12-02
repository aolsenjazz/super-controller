import { useConfigStub } from '@hooks/use-config-stub';
import { getDriver } from '@shared/drivers';

import DeviceIcon from '../DeviceIcon';

/**
 * Returns the css class depending on connection and configuration status
 */
function cssClassFor(connected: boolean, configured: boolean) {
  if (connected) {
    return configured ? 'configured' : 'connected';
  }
  return 'disconnected';
}

/**
 * Returns a human-readable string containing the connection and configuration status
 */
function statusFor(connected: boolean, configured: boolean) {
  return `${connected ? 'Connected' : 'Disconnected'}${
    configured ? ', Configured' : ''
  }`;
}

/**
 * Reformats an id into a more human-readable string
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
  connected: boolean;
  configured: boolean;
  name: string;
  driverName: string;
  siblingIndex: number;
};

export default function DeviceListItem(props: PropTypes) {
  const {
    deviceId,
    selected,
    onClick,
    connected,
    configured,
    name,
    driverName,
    siblingIndex,
  } = props;

  const { configStub } = useConfigStub(deviceId);

  return (
    <div className={`device-list-item ${selected ? 'active' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon driver={getDriver(driverName)} active={selected} />
      </div>
      <div
        className="device-list-item-label"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
      >
        <h2>{configStub?.nickname || name}</h2>
        <p className="id">{reformatId(deviceId, siblingIndex)}</p>
        <div
          className={`connection-color ${cssClassFor(connected, configured)}`}
        />
        <p className="connection-status">{statusFor(connected, configured)}</p>
      </div>
    </div>
  );
}
