import { useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { PanelState, usePanels } from '@context/panel-context';

import DeviceDrawer from './DeviceDrawer';
import DevicePanelContainer from './DevicePanel/DevicePanelContainer';
import InputConfigDrawer from './InputConfigDrawer';

type ImperativePanelActions = {
  collapse: () => void;
  expand: () => void;
};

function usePanelEffect(
  panelRef: React.MutableRefObject<null>,
  panelState: PanelState,
) {
  useEffect(() => {
    const { collapsed, requiresUpdate } = panelState;
    const ref = panelRef.current;
    if (ref && collapsed && requiresUpdate) {
      (ref as ImperativePanelActions).collapse();
    } else if (ref && !collapsed && requiresUpdate) {
      (ref as ImperativePanelActions).expand();
    }
  }, [panelRef, panelState]);
}

const { LayoutService } = window;

export default function MainContent() {
  const { panel1State, setPanel1, panel2State, setPanel2 } = usePanels();

  const deviceListPanelRef = useRef(null);
  const configPanelRef = useRef(null);

  usePanelEffect(deviceListPanelRef, panel1State);
  usePanelEffect(configPanelRef, panel2State);

  return (
    <div id="main-content">
      <PanelGroup
        direction="horizontal"
        className="main-content"
        storage={LayoutService}
        autoSaveId="main-content"
        disablePointerEventsDuringResize
      >
        <Panel
          minSize={25}
          defaultSize={25}
          maxSize={50}
          ref={deviceListPanelRef}
          id="device-drawer"
          onCollapse={(collapsed) => setPanel1(collapsed, false)}
          collapsible
        >
          <DeviceDrawer />
        </Panel>
        <PanelResizeHandle
          className="drag-handle"
          style={{
            borderRight: '1px solid #dbd4d1',
            backgroundColor: '#f4f0f1',
          }}
        />
        <Panel minSize={25} id="main" order={1}>
          <DevicePanelContainer />
        </Panel>
        <PanelResizeHandle
          className="drag-handle"
          style={{
            borderLeft: '1px solid #dbd4d1',
            backgroundColor: '#f4f0f1',
          }}
        />
        <Panel
          minSize={30}
          ref={configPanelRef}
          maxSize={50}
          defaultSize={25}
          id="config-drawer"
          order={2}
          onCollapse={(collapsed) => setPanel2(collapsed, false)}
          collapsible
        >
          <InputConfigDrawer />
        </Panel>
      </PanelGroup>
    </div>
  );
}
