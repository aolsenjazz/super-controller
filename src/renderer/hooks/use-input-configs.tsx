import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { ConfigService } = window;

export function useInputConfigs<T extends InputConfigStub = InputConfigStub>(
  deviceId: string,
  inputIds: string[]
) {
  const [inputConfigs, setInputConfigs] = useState<T[]>([]);

  useEffect(() => {
    const cb = () => {};

    const offs = inputIds.map((id) => {
      return ConfigService.onInputConfigChange(
        deviceId,
        id,
        (conf: InputConfigStub) => {}
      );
    });

    return () => {
      offs.forEach((off) => off());
    };
  }, [deviceId, inputIds]);

  return { inputConfigs };
}
