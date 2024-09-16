import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import type { InputIcicle } from '@shared/hardware-config/input-config/base-input-config';

import { useSelectedInputs } from './selected-inputs-context';
import { useSelectedDeviceConfig } from './selected-device-config-context';

const { DeviceConfigService } = window;

interface SelectedInputConfigsType {
  inputConfigs: InputIcicle[];
}

const SelectedInputConfigsContext = createContext<SelectedInputConfigsType>({
  inputConfigs: [],
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedInputConfigsProvider = ({ children }: PropTypes) => {
  const [inputConfigs, setInputConfigs] = useState<InputIcicle[]>([]);

  const { selectedInputs } = useSelectedInputs();
  const { deviceConfig } = useSelectedDeviceConfig();

  // whenever the selected device changes, register for callbacks to device config
  // changes so that we can update input configs as needed
  useEffect(() => {
    const cb = () => {
      if (deviceConfig) {
        const ins = DeviceConfigService.getInputConfigs(
          deviceConfig.id,
          selectedInputs
        );
        setInputConfigs(ins);
      }
    };
    cb();

    const off = DeviceConfigService.onDeviceConfigChange(
      deviceConfig?.id || '',
      cb
    );

    return () => off();
  }, [deviceConfig, selectedInputs]);

  return (
    <SelectedInputConfigsContext.Provider value={{ inputConfigs }}>
      {children}
    </SelectedInputConfigsContext.Provider>
  );
};

export const useSelectedInputConfigs = () => {
  const context = useContext(SelectedInputConfigsContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
