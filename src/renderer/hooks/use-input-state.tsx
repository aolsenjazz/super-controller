import { InputState } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';

const { deviceService } = window;

export function useInputState<T extends InputState>(
  deviceId: string,
  inputId: string,
  defaultState: T
) {
  const [state, setState] = useState<T>(defaultState);

  useEffect(() => {
    const cb = (s: T) => {
      setState(s);
    };

    const off = deviceService.onInputChange(deviceId, inputId, cb);
    deviceService.requestInputState(deviceId, inputId);

    return () => {
      setState(defaultState);
      off();
    };
  }, [deviceId, inputId, defaultState]);

  return { state };
}
