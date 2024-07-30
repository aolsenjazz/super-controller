import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

export type PanelState = {
  collapsed: boolean;
  requiresUpdate: boolean;
};

// Create a context for the panels' state
const PanelContext = createContext<{
  panel1State: PanelState;
  setPanel1: (collapsed: boolean, requiresUpdate: boolean) => void;
  panel2State: PanelState;
  setPanel2: (collapsed: boolean, requiresUdpate: boolean) => void;
}>({
  panel1State: { collapsed: false, requiresUpdate: false },
  panel2State: { collapsed: false, requiresUpdate: false },
  setPanel1: () => {},
  setPanel2: () => {},
});

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [panel1State, setPanel1State] = useState({
    collapsed: false,
    requiresUpdate: false,
  });
  const [panel2State, setPanel2State] = useState({
    collapsed: false,
    requiresUpdate: false,
  });

  const setPanel1 = useCallback(
    (collapsed: boolean, requiresUpdate: boolean) => {
      setPanel1State({ collapsed, requiresUpdate });
    },
    []
  );

  const setPanel2 = useCallback(
    (collapsed: boolean, requiresUpdate: boolean) => {
      setPanel2State({ collapsed, requiresUpdate });
    },
    []
  );

  // Use useMemo to create the context value object
  const contextValue = useMemo(
    () => ({
      panel1State,
      setPanel1,
      panel2State,
      setPanel2,
    }),
    [panel1State, panel2State, setPanel1, setPanel2]
  );

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
    </PanelContext.Provider>
  );
}

// Custom hook to use the panel context
export const usePanels = () => {
  return useContext(PanelContext);
};
