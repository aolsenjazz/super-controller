import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';

const { ConfigService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<ConfigStub[]>([]);

  useEffect(() => {
    const cb = (stubs: ConfigStub[]) => {
      setConfigStubs(stubs);
    };

    const off = ConfigService.onConfiguredDevicesChange(cb);

    return () => off();
  }, []);

  return { configStubs };
};
