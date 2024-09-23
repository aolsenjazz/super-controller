import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { DeviceConfigService } = window;

export function useInputConfig<T extends InputDTO = InputDTO>(
  deviceId: string,
  inputId: string
) {
  const [inputConfig, setInputConfig] = useState<T>();

  useEffect(() => {
    const cb = (config: T) => {
      setInputConfig(config);
    };

    const off = DeviceConfigService.onInputConfigChange<T>(
      deviceId,
      inputId,
      cb
    );

    return () => off();
  }, [deviceId, inputId]);

  return { inputConfig };
}
