import { DeviceStub } from '@shared/device-stub';
import { useState, useEffect } from 'react';

const { deviceService } = window;

export const useDeviceStub = (deviceId: string) => {
  const [deviceStub, setDeviceStub] = useState<DeviceStub | undefined>();

  useEffect(() => {
    const cb = (stub: DeviceStub | undefined) => {
      setDeviceStub(stub);
    };

    const off = deviceService.onDeviceChange(deviceId, cb);
    deviceService.requestDeviceStub(deviceId);

    return () => off();
  }, [deviceId]);

  return { deviceStub };
};
