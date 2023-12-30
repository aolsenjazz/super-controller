import { useState, useEffect } from 'react';
import { ConfigStub } from '@shared/hardware-config/device-config';

const { projectService } = window;

export const useConfiguredDevices = () => {
  const [configStubs, setConfigStubs] = useState<ConfigStub[]>([]);

  useEffect(() => {
    const cb = (stubs: ConfigStub[]) => {
      setConfigStubs(stubs);
    };

    const off = projectService.onConfiguredDevicesChange(cb);
    projectService.requestConfiguredDevices();

    return () => off();
  }, []);

  return { configStubs };
};
