import { useEffect, useState } from 'react';

import { Project } from '@shared/project';
import { PortInfo } from '@shared/port-info';
import { DeviceConfig } from '@shared/hardware-config';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';
import ProjectChangeListener from './components/ProjectChangeListener';

import './styles/App.global.css';

const { hostService } = window;

document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState<string>();

  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

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
    <>
      <TitleBar />
      <div id="main-content">
        <DeviceList
          setSelectedDevice={setSelectedDevice}
          selectedDevice={selectedDevice}
        />
        <DevicePanel
          selectedDevice={selectedDevice}
          selectedInputs={selectedInputs}
          setSelectedInputs={setSelectedInputs}
        />
        <ConfigPanel
          selectedDevice={selectedDevice}
          selectedInputs={selectedInputs}
        />
      </div>
    </>
  );
}
