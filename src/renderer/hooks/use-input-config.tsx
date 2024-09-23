import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { InputConfigService } = window;

export function useInputConfig<T extends InputDTO = InputDTO>(
  deviceId: string,
  inputId: string
) {
  const [inputConfig, setInputConfig] = useState<T>(() => {
    return InputConfigService.getInputConfig(deviceId, inputId);
  });

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
  }, [deviceId, inputId]);

  return { inputConfig };
}
