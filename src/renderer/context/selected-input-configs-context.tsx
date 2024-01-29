import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

import type { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import { useSelectedInputs } from './selected-inputs-context';
import { useSelectedDeviceConfig } from './selected-device-config-context';

const { ConfigService } = window;

interface SelectedInputConfigsType {
  inputConfigs: InputConfigStub[];
}

const SelectedInputConfigsContext = createContext<SelectedInputConfigsType>({
  inputConfigs: [],
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedInputConfigsProvider = ({ children }: PropTypes) => {
  const [inputConfigs, setInputConfigs] = useState<InputConfigStub[]>([]);

  const { selectedInputs } = useSelectedInputs();
  const { deviceConfig } = useSelectedDeviceConfig();

  useEffect(() => {
    if (deviceConfig) {
      const ins = ConfigService.getInputConfigs(
        deviceConfig.id,
        selectedInputs
      );
      setInputConfigs(ins);
    }
  }, [selectedInputs, deviceConfig]);

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
