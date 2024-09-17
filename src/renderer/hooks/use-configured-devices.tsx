import { useState, useEffect } from 'react';

const { DeviceConfigService } = window;

export const useConfiguredDevices = () => {
  const [configuredDeviceIds, setConfiguredDeviceIds] = useState<string[]>([]);

  useEffect(() => {
    const cb = (deviceConfigIds: string[]) => {
      setConfiguredDeviceIds(deviceConfigIds);
    };
    cb(DeviceConfigService.getConfiguredDevices());

    const off = DeviceConfigService.onConfiguredDevicesChange(cb);

    return () => off();
  }, []);

  return { configuredDeviceIds };
};
