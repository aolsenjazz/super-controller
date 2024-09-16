import { useState, useEffect } from 'react';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { ConfigService } = window;

export const useConfigStub = (configId: string) => {
  const [configStub, setConfigStub] = useState<DeviceConfigDTO | undefined>();

  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    const cb = (stub: DeviceConfigDTO | undefined) => {
      setConfigStub(stub);
    };

    ConfigService.onDeviceConfigChange(configId, cb);
  }, [configId, configStubs]);

  return { configStub };
};
