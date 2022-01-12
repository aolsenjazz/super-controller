import { useEffect, useState } from 'react';

import { Project } from '@shared/project';
import { PortInfo } from '@shared/port-info';
import {
  DeviceConfig,
  AnonymousDeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';
import ProjectChangeListener from './components/ProjectChangeListener';

import './styles/App.global.css';

const { ipcRenderer, driverService, portService } = window;
const drivers = driverService.getDrivers();

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
  const [ports, setPorts] = useState<PortInfo[]>([]);

  const [activeDevice, setActiveDevice] = useState<DeviceConfig | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  // Clear selected inputs when selectedId changes
  useEffect(() => {
    setSelectedInputs([]);
  }, [selectedId]);

  // Listen to changes to available MIDI ports
  useEffect(() => {
    const cb = (_e: Event, pairs: PortInfo[]) => {
      setPorts(
        pairs.map(
          (port) => new PortInfo(port.name, port.siblingIndex, port.connected)
        )
      );
    };
    const unsubscribe = ipcRenderer.on('ports', cb);
    portService.requestPorts();

    return () => unsubscribe();
  }, [project]);

  // Update the active device when selected index, project, or ports change
  useEffect(() => {
    let device: DeviceConfig | null = project.getDevice(selectedId);
    if (!device && ports.length > 0 && selectedId) {
      const portInfo = ports.filter((info) => info.id === selectedId)[0];

      if (Array.from(drivers.keys()).includes(portInfo?.name)) {
        // This port exists in config or hardware
        const driver = drivers.get(portInfo.name);

        if (!driver)
          throw new Error(`Unable to located driver for ${portInfo.name}`);

        device = SupportedDeviceConfig.fromDriver(
          portInfo.siblingIndex,
          driver
        );
      } else {
        // this port may or may not exist. if it exists, it must not be supported
        device =
          portInfo === undefined
            ? null
            : new AnonymousDeviceConfig(
                portInfo.name,
                portInfo.siblingIndex,
                new Map(),
                []
              );
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
          device={activeDevice}
          project={project}
          selectedInputs={selectedInputs}
          setProject={setProject}
        />
      </div>
    </>
  );
}
