import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { ConfigService } = window;

export const useConfigStub = (configId: string) => {
  const [configStub, setConfigStub] = useState<ConfigStub | undefined>();

  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    const cb = (stub: ConfigStub | undefined) => {
      setConfigStub(stub);
    };

    const off = ConfigService.onConfigChange(configId, cb);

    return () => off();
  }, [configId, configStubs]);

  return { configStub };
};
