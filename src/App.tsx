import React, { useEffect, useState } from 'react';
import { ipcRenderer, Event, IpcRendererEvent } from 'electron';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';
import ProjectChangeListener from './components/ProjectChangeListener';

import { Project } from './project';
import { PortInfo } from './ports/port-info';
import {
  DeviceConfig,
  AnonymousDeviceConfig,
  SupportedDeviceConfig,
} from './hardware-config';
import { DeviceDriver } from './driver-types';

import './styles/App.global.css';

document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

/**
 * Entry point for the frontend application. No calls to node modules are permitted
 * from the front end as they behave different due to different entry points
 * (.../src vs .../super-controller)
 *
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

  /* Currently-available hardware ports */
  const [ports, setPorts] = useState<PortInfo[]>([]);

  const [activeDevice, setActiveDevice] = useState<DeviceConfig | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<Map<string, DeviceDriver>>(new Map());

  /* Clear selected inputs when selectedId changes */
  useEffect(() => {
    setSelectedInputs([]);
  }, [selectedId]);

  /* Update the active device when selected index, project, or ports change */
  useEffect(() => {
    let device: DeviceConfig | null = project.getDevice(selectedId);
    if (!device && ports.length > 0 && selectedId) {
      const portInfo = ports.filter((info) => info.id === selectedId)[0];

      if (Array.from(drivers.keys()).includes(portInfo?.name)) {
        // This port exists in config or hardware
        device = SupportedDeviceConfig.fromDriver(
          portInfo.id,
          portInfo.occurrenceNumber,
          drivers.get(portInfo.name)!
        );
      } else {
        // this port may or may not exist. if it exists, it must not be supported
        device =
          portInfo === undefined
            ? null
            : new AnonymousDeviceConfig(
                portInfo.id,
                portInfo.name,
                portInfo.occurrenceNumber,
                new Map()
              );
      }
    }

    setActiveDevice(device);
  }, [ports, project, selectedId, drivers]);

  /* Receive drivers from the backend */
  useEffect(() => {
    const cb = (_e: IpcRendererEvent, d: [string, DeviceDriver][]) =>
      setDrivers(new Map(d));

    ipcRenderer.once('drivers', cb);
  }, []);

  /* Listen to changes to available MIDI ports */
  useEffect(() => {
    const cb = (_e: Event, pairs: PortInfo[]) => {
      setPorts(pairs);
    };

    ipcRenderer.on('ports', cb);
    return () => {
      ipcRenderer.removeListener('ports', cb);
    };
  }, [project]);

  return (
    <>
      <ProjectChangeListener setProject={setProject} project={project} />
      <TitleBar />
      <DeviceList
        ports={ports}
        drivers={drivers}
        project={project}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
      />
      <DevicePanel
        config={activeDevice}
        project={project}
        selectedInputs={selectedInputs}
        setSelectedInputs={setSelectedInputs}
      />
      <ConfigPanel
        device={activeDevice}
        project={project}
        selectedInputs={selectedInputs}
        setProject={setProject}
      />
    </>
  );
}
