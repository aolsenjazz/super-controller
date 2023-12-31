import { useState, useEffect } from 'react';
import { DeviceStub } from '@shared/device-stub';

const { HostService } = window;

export const useConnectedDevices = () => {
  const [connectedDevices, setConnectedDevices] = useState<DeviceStub[]>([]);

  useEffect(() => {
    const cb = (stubs: DeviceStub[]) => {
      setConnectedDevices(stubs);
    };

    const off = HostService.onConnectedDevicesChange(cb);

    return () => off();
  }, []);

  return { connectedDevices };
};
