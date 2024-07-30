import { useState, useEffect } from 'react';
import { DeviceIcicle } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { ConfigService } = window;

export const useConfigStub = (configId: string) => {
  const [configStub, setConfigStub] = useState<DeviceIcicle | undefined>();

  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    const cb = (stub: DeviceIcicle | undefined) => {
      setConfigStub(stub);
    };

    ConfigService.onDeviceConfigChange(configId, cb);
  }, [configId, configStubs]);

  return { configStub };
};
