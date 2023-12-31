import { DeviceStub } from '@shared/device-stub';
import { useState, useEffect } from 'react';

const { HostService } = window;

export const useDeviceStub = (deviceId: string) => {
  const [deviceStub, setDeviceStub] = useState<DeviceStub | undefined>();

  useEffect(() => {
    const cb = (stub: DeviceStub | undefined) => {
      setDeviceStub(stub);
    };

    const off = HostService.onDeviceChange(deviceId, cb);

    return () => off();
  }, [deviceId]);

  return { deviceStub };
};
