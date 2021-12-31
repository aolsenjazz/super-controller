import { DeviceDriver } from '@shared/driver-types';

import DeviceIcon from './DeviceIcon';

/**
 * Returns the css class depending on connection and configuration status
 *
 * @param { boolean } connected Is the device connected?
 * @param { boolean } configured Is the device added to the current project?
 * @return { string } A css class
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
 * @param { boolean } connected Is the device connected?
 * @param { boolean } configured Is the device added to the current project?
 * @return { string } A status string
 */
function statusFor(connected: boolean, configured: boolean) {
  return `${connected ? 'Connected' : 'Disconnected'}${
    configured ? ', Configured' : ''
  }`;
}

/**
 * Reformats an id into a more human-readable string
 *
 * @param { string } id The id of the device/port
 * @param { number } occurNumber The nth time this device model is connected
 * @return { string } A prettier id
 */
function reformatId(id: string, occurNumber: number) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  const deviceName = id.substring(0, lastSpaceIdx);

  return occurNumber === 0 ? deviceName : `${deviceName} (${occurNumber})`;
}

type PropTypes = {
  name: string;
  id: string;
  occurenceNumber: number;
  onClick: () => void;
  active: boolean;
  configured: boolean;
  connected: boolean;
  driver: DeviceDriver;
};

/**
 * List item in the devices panel. Displays name, a stylized ID icon, and connection status.
 *
 * @param props Component props
 * @param props.name The name of the port
 * @param props.id Port id
 * @param props.occurenceNumber The nth time this device is connected (if > 1 device of same model connected)
 * @param props.onClick Click listener
 * @param props.active Is this the currently selected device?
 * @param props.configured Is this device added to the current project?
 * @param props.connected Is the device connected?
 * @param props.driver The driver for this list item
 */
export default function DeviceListItem(props: PropTypes) {
  const {
    onClick,
    active,
    connected,
    configured,
    name,
    occurenceNumber,
    id,
    driver,
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
        <h2 className={`${active ? 'selected' : ''}`}>{name}</h2>
        <p className={`id ${active ? 'selected' : ''}`}>
          {reformatId(id, occurenceNumber)}
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
