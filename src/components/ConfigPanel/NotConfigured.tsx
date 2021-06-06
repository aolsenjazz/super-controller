import React, { useCallback } from 'react';

import { ipcRenderer } from '../../ipc-renderer';
import { SupportedDeviceConfig } from '../../hardware-config';

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
