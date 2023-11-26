import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { deviceService } = window;

export const useConfigStub = (configId: string) => {
  const [configStub, setConfigStub] = useState<ConfigStub | undefined>();

  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    const cb = (stub: ConfigStub | undefined) => {
      setConfigStub(stub);
    };

    const off = deviceService.onConfigChange(configId, cb);
    deviceService.requestConfigStub(configId);

    return () => off();
  }, [configId, configStubs]);

  return { configStub };
};
