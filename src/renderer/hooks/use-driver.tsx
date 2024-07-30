import { useState, useEffect } from 'react';
import { getDriver } from '@shared/drivers';
import { DeviceDriver } from '@shared/driver-types';

export const useDeviceDriver = (driverId: string) => {
  const [driver, setDriver] = useState<DeviceDriver | undefined>();

  useEffect(() => {
    const loadDriver = () => {
      const fetchedDriver = getDriver(driverId);
      setDriver(fetchedDriver);
    };

    loadDriver();
  }, [driverId]);

  return { driver };
};
