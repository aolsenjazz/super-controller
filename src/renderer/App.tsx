import { useState } from 'react';

import { DeviceProvider } from './context/device-context';
import { SelectedInputsProvider } from './context/selected-inputs-context';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';

import './styles/App.global.css';

document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

export default function App() {
  // Clear selected inputs when selectedId changes
  // useEffect(() => {
  //   setSelectedInputs([]);
  // }, [selectedPort]);

  // Listen to changes to available MIDI ports
  // useEffect(() => {
  //   const cb = (p: PortInfo[]) => {
  //     setPorts(p.map((i) => new PortInfo(i.name, i.siblingIndex, i.connected)));
  //   };

  //   const unsubscribe = hostService.onPortsChange(cb);
  //   hostService.requestPorts();
  //   return () => unsubscribe();
  // }, [project]);

  // Update the active device when selected index, project, or ports change
  // useEffect(() => {
  //   const config = project.getDevice(selectedPort?.id);
  //   setActiveConfig(config);
  // }, [ports, project, selectedPort]);

  return (
    <DeviceProvider>
      <SelectedInputsProvider>
        <TitleBar />
        <div id="main-content">
          <DeviceList />
          <DevicePanel />
          <ConfigPanel />
        </div>
      </SelectedInputsProvider>
    </DeviceProvider>
  );
}
