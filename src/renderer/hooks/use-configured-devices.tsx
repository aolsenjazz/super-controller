import { useState, useEffect } from 'react';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

const { DeviceConfigService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<DeviceConfigDTO[]>(
    DeviceConfigService.getConfiguredDevices()
  );

  useEffect(() => {
    const cb = (stubs: DeviceConfigDTO[]) => {
      setConfigStubs(stubs);
    };

    const off = DeviceConfigService.onConfiguredDevicesChange(cb);

    return () => off();
  }, []);

  return { configStubs };
};
