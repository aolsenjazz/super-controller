import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';

const { deviceService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<ConfigStub[]>([]);

  useEffect(() => {
    const cb = (stubs: ConfigStub[]) => {
      setConfigStubs(stubs);
    };

    const off = deviceService.onConfiguredDevicesChange(cb);
    deviceService.requestConfiguredDevices();

    return () => off();
  }, []);

  return { configStubs };
};
