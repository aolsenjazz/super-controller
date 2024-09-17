import { useState, useEffect, useMemo } from 'react';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from './use-configured-devices';

const { DeviceConfigService } = window;

export const useDeviceConfig = (deviceConfigId: string) => {
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfigDTO | undefined>(
    undefined
  );
  const { configuredDeviceIds } = useConfiguredDevices();

  const configured = useMemo(() => {
    return configuredDeviceIds.includes(deviceConfigId);
  }, [configuredDeviceIds, deviceConfigId]);

  useEffect(() => {
    const cb = (c: DeviceConfigDTO | undefined) => {
      setDeviceConfig(c);
    };
    setDeviceConfig(DeviceConfigService.getDeviceConfig(deviceConfigId));

    const off = DeviceConfigService.onDeviceConfigChange(deviceConfigId, cb);

    return () => off();
  }, [deviceConfigId, configured]);

  return { deviceConfig };
};
