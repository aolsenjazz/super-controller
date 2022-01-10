import { DeviceDriver } from '@shared/driver-types';

import DeviceIcon from './DeviceIcon';

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
  name: string;
  id: string;
  siblingIndex: number;
  onClick: () => void;
  active: boolean;
  configured: boolean;
  connected: boolean;
  driver: DeviceDriver;
  nickname: string | undefined;
};

/**
 * List item in the devices panel. Displays name, a stylized ID icon, and connection status.
 *
 * @param props Component props
 * @param props.name The name of the port
 * @param props.id Port id
 * @param props.siblingIndex The nth time this device is connected (if > 1 device of same model connected)
 * @param props.onClick Click listener
 * @param props.active Is this the currently selected device?
 * @param props.configured Is this device added to the current project?
 * @param props.connected Is the device connected?
 * @param props.driver The driver for this list item
 * @param props.nickname Device nickname
 */
export default function DeviceListItem(props: PropTypes) {
  const {
    onClick,
    active,
    connected,
    configured,
    name,
    siblingIndex,
    id,
    driver,
    nickname,
  } = props;

  return (
    <div className={`nav-item ${active ? 'selected' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon driver={driver} active={active} />
      </div>
      <div
        className="nav-item-label"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
      >
        <h2 className={`${active ? 'selected' : ''}`}>{nickname || name}</h2>
        <p className={`id ${active ? 'selected' : ''}`}>
          {reformatId(id, siblingIndex)}
        </p>
        <div
          className={`connection-color ${cssClassFor(connected, configured)}`}
        />
        <p className={`connection-status ${active ? 'selected' : ''}`}>
          {statusFor(connected, configured)}
        </p>
      </div>
    </div>
  );
}
