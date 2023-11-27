import { InputState } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';
import { useConfiguredDevices } from './use-configured-devices';

const { deviceService } = window;

export function useInputState<T extends InputState>(
  deviceId: string,
  inputId: string,
  defaultState: T
) {
  const [state, setState] = useState<T>(defaultState);
  const { configStubs } = useConfiguredDevices();

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
  }, [deviceId, inputId, defaultState, configStubs]);

  return { state };
}
