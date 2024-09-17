import { DeviceConnectionDetails } from '@shared/device-connection-details';
import { useState, useEffect } from 'react';

const { HostService } = window;

export const useDeviceConnectionDetails = (deviceId: string) => {
  const [deviceConnectionDetails, setDeviceConnectionDetails] = useState<
    DeviceConnectionDetails | undefined
  >();

  useEffect(() => {
    const cb = (stub: DeviceConnectionDetails | undefined) => {
      setDeviceConnectionDetails(stub);
    };

    const off = HostService.onDeviceChange(deviceId, cb);

    return () => off();
  }, [deviceId]);

  return { deviceConnectionDetails };
};
