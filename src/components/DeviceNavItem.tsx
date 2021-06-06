import React from 'react';

import DeviceIcon from './DeviceIcon/DeviceIcon';
import { DeviceDriver } from '../driver-types';
import { anonymousDriver } from '../anonymous-device';

function cssClassFor(connected: boolean, configured: boolean) {
  if (connected) {
    return configured ? 'configured' : 'connected';
  }
  return 'disconnected';
}

function statusFor(connected: boolean, configured: boolean) {
  return `${connected ? 'Connected' : 'Disconnected'}${
    configured ? ', Configured' : ''
  }`;
}

function reformatId(id: string, occurNumber: number) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  const deviceName = id.substring(0, lastSpaceIdx);

  return occurNumber === 0 ? deviceName : `${deviceName} (${occurNumber})`;
}

function nameFromId(id: string) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  return id.substring(0, lastSpaceIdx);
}

type PropTypes = {
  name: string;
  id: string;
  occurenceNumber: number;
  onClick: () => void;
  active: boolean;
  configured: boolean;
  connected: boolean;
  drivers: Map<string, DeviceDriver>;
};

export default function DeviceNavItem(props: PropTypes) {
  const {
    onClick,
    active,
    connected,
    configured,
    name,
    occurenceNumber,
    id,
    drivers,
  } = props;

  const device = drivers.get(nameFromId(id));
  const deviceOrAnonymous = device || anonymousDriver;

  return (
    <div className={`nav-item ${active ? 'selected' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon device={deviceOrAnonymous} active={active} />
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
