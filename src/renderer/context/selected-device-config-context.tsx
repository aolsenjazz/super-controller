import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import type { DeviceIcicle } from '@shared/hardware-config/device-config';

import { useSelectedDevice } from './selected-device-context';

const { ConfigService } = window;

interface SelectedDeviceConfigContextType {
  deviceConfig: DeviceIcicle | undefined;
}

const SelectedDeviceConfigContext =
  createContext<SelectedDeviceConfigContextType>({
    deviceConfig: undefined,
  });

type PropTypes = {
  children: ReactNode;
};

export const SelectedDeviceConfigProvider = ({ children }: PropTypes) => {
  const [deviceConfig, setDeviceConfig] = useState<DeviceIcicle>();
  const { selectedDevice } = useSelectedDevice();

  useEffect(() => {
    setDeviceConfig(ConfigService.getDeviceConfig(selectedDevice || ''));

    const cb = (stub?: DeviceIcicle) => {
      setDeviceConfig(stub);
    };

    const off = ConfigService.onDeviceConfigChange(selectedDevice || '', cb);

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
