import { InputState } from '@shared/hardware-config/input-config/base-input-config';
import { useState, useEffect } from 'react';
import { useConfiguredDevices } from './use-configured-devices';

const { HostService } = window;

export function useInputState<T extends InputState>(
  deviceId: string,
  inputId: string,
  defaultState: T
) {
  const [state, setState] = useState<T>(defaultState);
  const { configuredDeviceIds } = useConfiguredDevices();

  useEffect(() => {
    const cb = (s: T) => {
      setState(s);
    };

    const off = HostService.onInputChange(deviceId, inputId, cb);

    return () => {
      setState(defaultState);
      off();
    };
  }, [deviceId, inputId, defaultState, configuredDeviceIds]);

  return { state };
}
