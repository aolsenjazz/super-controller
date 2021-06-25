import React, { useCallback } from 'react';

import { ipcRenderer } from '../../ipc-renderer';
import { SupportedDeviceConfig } from '../../hardware-config';

/**
 * Inform the current user that the device isn't configured, and allow them to configure
 *
 * @param { object } props Component props
 * @param { SupportedDeviceConfig } props.config Configuration of the current device
 */
export default function NotConfigured(props: {
  config: SupportedDeviceConfig;
}) {
  const { config } = props;

  const onClick = useCallback(() => {
    ipcRenderer.addDevice(config.id, config.name, config.occurrenceNumber);
  }, [config]);

  return (
    <div className="center-vert message">
      <p>Device is not yet configured.</p>
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
