import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';
import { useConfiguredDevices } from './use-configured-devices';

const { InputConfigService } = window;

export function useInputConfig<T extends InputDTO = InputDTO>(
  deviceId: string,
  inputId: string
) {
  const [inputConfig, setInputConfig] = useState<T>(() => {
    return InputConfigService.getInputConfig(deviceId, inputId);
  });

  const { configuredDeviceIds } = useConfiguredDevices();

  useEffect(() => {
    const cb = (config: T) => {
      setInputConfig(config);
    };
    cb(InputConfigService.getInputConfig(deviceId, inputId));

    const off = InputConfigService.onInputConfigChange<T>(
      deviceId,
      inputId,
      cb
    );

    return () => off();
  }, [deviceId, inputId, configuredDeviceIds]);

  return { inputConfig };
}
