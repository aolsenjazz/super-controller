import { useState, useEffect } from 'react';
import { DeviceIcicle } from '@shared/hardware-config/device-config';

const { ConfigService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<DeviceIcicle[]>(
    ConfigService.getConfiguredDevices()
  );

  useEffect(() => {
    const cb = (stubs: DeviceIcicle[]) => {
      setConfigStubs(stubs);
    };

    const off = ConfigService.onConfiguredDevicesChange(cb);

    return () => off();
  }, []);

  return { configStubs };
};
