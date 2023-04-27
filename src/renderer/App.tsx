import { useEffect, useState } from 'react';

import { Project } from '@shared/project';
import { DrivenPortInfo } from '@shared/driven-port-info';
import { DeviceConfig, configFromDriver } from '@shared/hardware-config';

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
  const [ports, setPorts] = useState<DrivenPortInfo[]>([]);

  const [activeConfig, setActiveConfig] = useState<DeviceConfig | undefined>();

  // Selected device ID
  const [selectedId, setSelectedId] = useState<string>();

  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  // Clear selected inputs when selectedId changes
  useEffect(() => {
    setSelectedInputs([]);
  }, [selectedId]);

  // Listen to changes to available MIDI ports
  useEffect(() => {
    const cb = (p: DrivenPortInfo[]) =>
      setPorts(
        p.map((i) => {
          return new DrivenPortInfo(
            i.name,
            i.siblingIndex,
            i.connected,
            i.driver
          );
        })
      );
    const unsubscribe = hostService.onPortsChange(cb);
    hostService.requestPorts();
    return () => unsubscribe();
  }, [project]);

  // Update the active device when selected index, project, or ports change
  useEffect(() => {
    let config = project.getDevice(selectedId);

    if (ports.length > 0) {
      const portInfo = ports.filter((info) => info.id === selectedId)[0];
      if (!config && selectedId && portInfo) {
        config = configFromDriver(portInfo.siblingIndex, portInfo.driver);
      }
    }

    setActiveConfig(config);
  }, [ports, project, selectedId]);

  return (
    <>
      <ProjectChangeListener setProject={setProject} project={project} />
      <TitleBar />
      <div id="main-content">
        <DeviceList
          ports={ports}
          project={project}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
        />
        <DevicePanel
          config={activeConfig}
          configured={project.getDevice(activeConfig?.id) !== undefined}
          selectedInputs={selectedInputs}
          setSelectedInputs={setSelectedInputs}
        />
        <ConfigPanel
          config={activeConfig}
          project={project}
          selectedInputs={selectedInputs}
          setProject={setProject}
        />
      </div>
    </>
  );
}
