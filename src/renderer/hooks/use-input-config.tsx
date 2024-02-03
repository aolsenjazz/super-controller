import { InputIcicle } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { ConfigService } = window;

export function useInputConfig<T extends InputIcicle = InputIcicle>(
  deviceId: string,
  inputId: string
) {
  const [inputConfig, setInputConfig] = useState<T>();

  useEffect(() => {
    const cb = (config: T) => {
      setInputConfig(config);
    };

    const off = ConfigService.onInputConfigChange<T>(deviceId, inputId, cb);

    return () => off();
  }, [deviceId, inputId]);

  return { inputConfig };
}
