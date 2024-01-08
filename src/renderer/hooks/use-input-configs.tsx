import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { ConfigService } = window;

export function useInputConfigs<T extends InputConfigStub = InputConfigStub>(
  deviceId: string,
  inputIds: string[]
) {
  const [inputConfigs, setInputConfigs] = useState<T[]>([]);

  useEffect(() => {
    const cb = (configs: T[]) => {
      setInputConfigs(configs);
    };

    const off = ConfigService.onInputConfigsChange<T>(cb);

    return () => off();
  }, [deviceId, inputIds]);

  return { inputConfigs };
}
