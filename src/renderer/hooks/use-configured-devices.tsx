import { useState, useEffect } from 'react';
import { DeviceConfigStub } from '@shared/hardware-config/device-config';

const { ConfigService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<DeviceConfigStub[]>([]);

  useEffect(() => {
    const cb = (stubs: DeviceConfigStub[]) => {
      setConfigStubs(stubs);
    };

    const off = ConfigService.onConfiguredDevicesChange(cb);

    return () => off();
  }, []);

  return { configStubs };
};
