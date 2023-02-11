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
 * State and communication are managed in the backend. When device state changes
 * (an input is manipulated), those messages are forwarded from the backend to
 * update state appropriately here (more below).
 *
 * PROJECT + CONFIGURATION UPDATES
 * `Project` state is stored both in the front and backend. As such, all changes to
 * state in either part of the application need to be propagated to the other process
 * and have the same update made.
 */
export default function App() {
  const [project, setProject] = useState(new Project());

  // Currently-available hardware ports
  const [ports, setPorts] = useState<DrivenPortInfo[]>([]);

  const [activeDevice, setActiveDevice] = useState<DeviceConfig | undefined>();

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
    let device = project.getDevice(selectedId);

    if (ports.length > 0) {
      const portInfo = ports.filter((info) => info.id === selectedId)[0];
      if (!device && selectedId && portInfo) {
        device = configFromDriver(portInfo.siblingIndex, portInfo.driver);
      }
    }

    setActiveDevice(device);
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
          config={activeDevice}
          configured={project.getDevice(activeDevice?.id) !== undefined}
          selectedInputs={selectedInputs}
          setSelectedInputs={setSelectedInputs}
        />
        <ConfigPanel
          config={activeDevice}
          project={project}
          selectedInputs={selectedInputs}
          setProject={setProject}
        />
      </div>
    </>
  );
}
