import { useState, useContext, createContext, ReactNode } from 'react';

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
