import React, { useState, useEffect } from 'react';
import { ConfigDescriptor } from '@shared/hardware-config/device-config';

const { deviceService } = window;

export const useConfigDescriptor = (configId: string) => {
  const [configDescriptor, setConfigDescriptor] = useState<
    ConfigDescriptor | undefined
  >();

  useEffect(() => {
    const cb = (desc: ConfigDescriptor | undefined) => {
      setConfigDescriptor(desc);
    };

    const off = deviceService.onConfigChange(configId, cb);
    deviceService.requestConfigDescriptor(configId);

    return () => off();
  }, [configId]);

  return { configDescriptor };
};
