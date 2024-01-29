import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import type { DeviceConfigStub } from '@shared/hardware-config/device-config';

import { useSelectedDevice } from './selected-device-context';

const { ConfigService } = window;

interface SelectedDeviceConfigContextType {
  deviceConfig: DeviceConfigStub | undefined;
}

const SelectedDeviceConfigContext =
  createContext<SelectedDeviceConfigContextType>({
    deviceConfig: undefined,
  });

type PropTypes = {
  children: ReactNode;
};

export const SelectedDeviceConfigProvider = ({ children }: PropTypes) => {
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfigStub>();
  const { selectedDevice } = useSelectedDevice();

  useEffect(() => {
    const cb = (stub?: DeviceConfigStub) => {
      setDeviceConfig(stub);
    };

    const off = ConfigService.onConfigChange(selectedDevice || '', cb);

    return () => off();
  }, [selectedDevice, setDeviceConfig]);

  return (
    <SelectedDeviceConfigContext.Provider value={{ deviceConfig }}>
      {children}
    </SelectedDeviceConfigContext.Provider>
  );
};

export const useSelectedDeviceConfig = () => {
  const context = useContext(SelectedDeviceConfigContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
