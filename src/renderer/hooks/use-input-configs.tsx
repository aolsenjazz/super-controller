import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { ConfigService } = window;

export const useInputConfigs = (deviceId: string, inputIds: string[]) => {
  const [inputConfigs, setInputConfigs] = useState<InputConfigStub[]>([]);

  useEffect(() => {
    const cb = (configs: InputConfigStub[]) => {
      setInputConfigs(configs);
    };

    const off = ConfigService.onInputConfigChange(cb);

    return () => off();
  }, [deviceId, inputIds]);

  return { inputConfigs };
};
