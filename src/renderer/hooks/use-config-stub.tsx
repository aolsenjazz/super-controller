import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { projectService } = window;

export const useConfigStub = (configId: string) => {
  const [configStub, setConfigStub] = useState<ConfigStub | undefined>();

  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    const cb = (stub: ConfigStub | undefined) => {
      setConfigStub(stub);
    };

    const off = projectService.onConfigChange(configId, cb);
    projectService.requestConfigStub(configId);

    return () => off();
  }, [configId, configStubs]);

  return { configStub };
};
