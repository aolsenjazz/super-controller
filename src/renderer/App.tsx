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

/**
 * DEVICE STATE + COMMUNICATION
 * State is managed in both frontend in backend processes; once a message is received in the
 * backend, it is applied to the backend-copy of the project config, then send to the
 * frontend process to be applied in the frontend-copy of the project config.
 */
export default function App() {
  const [project, setProject] = useState(new Project());

  // Currently-available hardware ports
  const [ports, setPorts] = useState<PortInfo[]>([]);

  const [activeConfig, setActiveConfig] = useState<DeviceConfig | undefined>();

  // Selected device ID
  const [selectedPort, setSelectedPort] = useState<PortInfo>();

  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  // Clear selected inputs when selectedId changes
  useEffect(() => {
    setSelectedInputs([]);
  }, [selectedPort]);

  // Listen to changes to available MIDI ports
  useEffect(() => {
    const cb = (p: PortInfo[]) => {
      setPorts(p.map((i) => new PortInfo(i.name, i.siblingIndex, i.connected)));
    };

    const unsubscribe = hostService.onPortsChange(cb);
    hostService.requestPorts();
    return () => unsubscribe();
  }, [project]);

  // Update the active device when selected index, project, or ports change
  useEffect(() => {
    const config = project.getDevice(selectedPort?.id);
    setActiveConfig(config);
  }, [ports, project, selectedPort]);

  return (
    <>
      <ProjectChangeListener setProject={setProject} project={project} />
      <TitleBar />
      <div id="main-content">
        <DeviceList
          ports={ports}
          project={project}
          setSelectedPort={setSelectedPort}
          selectedPort={selectedPort}
        />
        <DevicePanel
          selectedPort={selectedPort}
          config={activeConfig}
          selectedInputs={selectedInputs}
          setSelectedInputs={setSelectedInputs}
        />
        <ConfigPanel
          config={activeConfig}
          project={project}
          selectedPort={selectedPort}
          selectedInputs={selectedInputs}
          setProject={setProject}
        />
      </div>
    </>
  );
}
