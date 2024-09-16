import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import type { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useConfiguredDevices } from '@hooks/use-configured-devices';

import { useSelectedDevice } from './selected-device-context';

const { DeviceConfigService } = window;

interface SelectedDeviceConfigContextType {
  deviceConfig: DeviceConfigDTO | undefined;
}

const SelectedDeviceConfigContext =
  createContext<SelectedDeviceConfigContextType>({
    deviceConfig: undefined,
  });

type PropTypes = {
  children: ReactNode;
};

export const SelectedDeviceConfigProvider = ({ children }: PropTypes) => {
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfigDTO>();
  const { selectedDevice } = useSelectedDevice();
  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    setDeviceConfig(DeviceConfigService.getDeviceConfig(selectedDevice || ''));

    const cb = (stub?: DeviceConfigDTO) => {
      setDeviceConfig(stub);
    };

    const off = DeviceConfigService.onDeviceConfigChange(
      selectedDevice || '',
      cb
    );

    return () => off();
  }, [selectedDevice, setDeviceConfig, configStubs]);

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
