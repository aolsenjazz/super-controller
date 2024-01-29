import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import type { BaseInputConfig } from '@shared/hardware-config';
import { useSelectedInputs } from './selected-inputs-context';

interface SelectedInputConfigsType {
  inputConfigs: BaseInputConfig[];
}

const SelectedInputConfigsContext = createContext<SelectedInputConfigsType>({
  inputConfigs: [],
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedInputConfigsProvider = ({ children }: PropTypes) => {
  const [inputConfigs, setInputConfigs] = useState<BaseInputConfig[]>([]);

  const [selectedInputs] = useSelectedInputs();
  // const [selected]

  useEffect(() => {
    if (selectedInputs.length === 0) {
      setInputConfigs([]);
      return;
    }
  }, [selectedInputs]);

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
