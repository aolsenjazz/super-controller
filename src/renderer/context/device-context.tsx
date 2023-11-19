import { useState, useContext, createContext, ReactNode } from 'react';

interface DeviceContextType {
  selectedDevice: string | undefined;
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DeviceContext = createContext<DeviceContextType>({
  selectedDevice: undefined,
  setSelectedDevice: () => {},
});

type PropTypes = {
  children: ReactNode;
};

export const DeviceProvider = ({ children }: PropTypes) => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();

  return (
    <DeviceContext.Provider value={{ selectedDevice, setSelectedDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
