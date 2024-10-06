import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';

import type { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { selectSelectedDevice } from '@selectors/selected-device-selector';

import { useSelectedInputs } from './selected-inputs-context';

const { InputConfigService } = window;

interface SelectedInputConfigsType {
  inputConfigs: InputDTO[];
}

const SelectedInputConfigsContext = createContext<SelectedInputConfigsType>({
  inputConfigs: [],
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedInputConfigsProvider = ({ children }: PropTypes) => {
  const [inputConfigs, setInputConfigs] = useState<InputDTO[]>([]);

  const { selectedInputs } = useSelectedInputs();
  const selectedDevice = useSelector(selectSelectedDevice);

  useEffect(() => {
    const cb = (inputs: InputDTO[]) => {
      setInputConfigs(inputs);
    };
    cb(
      InputConfigService.getInputConfigs(
        selectedDevice?.id || '',
        selectedInputs
      )
    );

    const off = InputConfigService.addInputsChangeListener(cb);

    return () => off();
  }, [selectedDevice, selectedInputs]);

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
