import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import { useSelectedDevice } from './selected-device-context';

interface SelectedPluginContextType {
  selectedPlugin: string;
  setSelectedPlugin: React.Dispatch<React.SetStateAction<string>>;
}

const SelectedPluginContext = createContext<SelectedPluginContextType>({
  selectedPlugin: '',
  setSelectedPlugin: () => {},
});

type PropTypes = {
  children: ReactNode;
};

export const SelectedPluginProvider = ({ children }: PropTypes) => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>('');

  const { selectedDevice } = useSelectedDevice();

  useEffect(() => {
    setSelectedPlugin('');
  }, [selectedDevice]);

  return (
    <SelectedPluginContext.Provider
      value={{ selectedPlugin, setSelectedPlugin }}
    >
      {children}
    </SelectedPluginContext.Provider>
  );
};

export const useSelectedPlugin = () => {
  const context = useContext(SelectedPluginContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
