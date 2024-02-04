import { useConfiguredDevices } from '@hooks/use-configured-devices';
import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import { useSelectedDevice } from './selected-device-context';

interface SelectedInputsContextType {
  selectedInputs: string[];
  setSelectedInputs: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedInputsContext = createContext<SelectedInputsContextType>({
  selectedInputs: [],
  setSelectedInputs: () => {},
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedInputsProvider = ({ children }: PropTypes) => {
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  const { selectedDevice } = useSelectedDevice();
  const { configStubs } = useConfiguredDevices();

  useEffect(() => {
    setSelectedInputs([]);
  }, [selectedDevice, configStubs]);

  return (
    <SelectedInputsContext.Provider
      value={{ selectedInputs, setSelectedInputs }}
    >
      {children}
    </SelectedInputsContext.Provider>
  );
};

export const useSelectedInputs = () => {
  const context = useContext(SelectedInputsContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
