import { useConfiguredDevices } from '@hooks/use-configured-devices';
import { useConnectedDevices } from '@hooks/use-connected-devices';
import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';

interface SelectedDeviceContextType {
  selectedDevice: string | undefined;
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SelectedDeviceContext = createContext<SelectedDeviceContextType>({
  selectedDevice: undefined,
  setSelectedDevice: () => {},
});

type PropTypes = {
  children: ReactNode;
};

export const DeviceProvider = ({ children }: PropTypes) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();

  const { connectedDevices } = useConnectedDevices();
  const { configStubs } = useConfiguredDevices();

  // when the available/configured devices change, if an item is selected which no
  // longer exists, switch to another item
  useEffect(() => {
    const sortedIds = [
      ...connectedDevices.map((d) => d.id),
      ...configStubs.map((s) => s.id),
    ];

    if (!sortedIds.includes(selectedDevice || '')) {
      setSelectedDevice(sortedIds.length === 0 ? undefined : sortedIds[0]);
    }
  }, [selectedDevice, setSelectedDevice, connectedDevices, configStubs]);

  return (
    <SelectedDeviceContext.Provider
      value={{ selectedDevice, setSelectedDevice }}
    >
      {children}
    </SelectedDeviceContext.Provider>
  );
};

export const useSelectedDevice = () => {
  const context = useContext(SelectedDeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
