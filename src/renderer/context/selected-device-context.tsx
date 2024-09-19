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

  const { connectedDeviceIds } = useConnectedDevices();
  const { configuredDeviceIds } = useConfiguredDevices();

  // Whenever the available hardware connections/configured devices change,
  // update the currently-selected device
  useEffect(() => {
    const merge = [...connectedDeviceIds, ...configuredDeviceIds];

    const isCurrentDevicePresent = merge.find((id) => id === selectedDevice);

    if (selectedDevice === undefined && merge.length > 0) {
      setSelectedDevice(merge[0]);
    } else {
      const newDevice = merge.length > 0 ? merge[0] : undefined;

      if (!isCurrentDevicePresent) {
        setSelectedDevice(newDevice);
      }
    }
  }, [connectedDeviceIds, configuredDeviceIds, selectedDevice]);

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
    throw new Error('useSelectedDevice must be used within a DeviceProvider');
  }
  return context;
};
