import { useState, useEffect } from 'react';
import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';

const { deviceService } = window;

export const useDeviceDescriptor = (deviceId: string) => {
  const [descriptor, setDescriptor] = useState<DeviceDescriptor | undefined>();

  useEffect(() => {
    const cb = (desc: DeviceDescriptor) => {
      setDescriptor(desc);
    };

    const off = deviceService.onDeviceChange(deviceId, cb);
    deviceService.requestDeviceDescriptor(deviceId);

    return () => off();
  }, [deviceId]);

  return { descriptor };
};
