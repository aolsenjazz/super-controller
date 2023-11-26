import { useState, useEffect } from 'react';
import { DeviceStub } from '@shared/device-stub';

const { deviceService } = window;

export const useConnectedDevices = () => {
  const [connectedDevices, setConnectedDevices] = useState<DeviceStub[]>([]);

  useEffect(() => {
    const cb = (stubs: DeviceStub[]) => {
      setConnectedDevices(stubs);
    };

    const off = deviceService.onConnectedDevicesChange(cb);
    deviceService.requestConnectedDevices();

    return () => off();
  }, []);

  return { connectedDevices };
};
