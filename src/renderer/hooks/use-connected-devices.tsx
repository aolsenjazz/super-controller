import { useState, useEffect } from 'react';

const { HostService } = window;

export const useConnectedDevices = () => {
  const [connectedDeviceIds, setConnectedDeviceIds] = useState<string[]>([]);

  useEffect(() => {
    const cb = (deviceIds: string[]) => {
      setConnectedDeviceIds(deviceIds);
    };

    const off = HostService.onConnectedDevicesChange(cb);

    return () => off();
  }, []);

  return { connectedDeviceIds };
};
