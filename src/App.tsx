import React, { useEffect, useState } from 'react';
import { ipcRenderer, Event, IpcRendererEvent } from 'electron';

import TitleBar from './components/TitleBar';
import NavBar from './components/NavBar';
import DevicePanel from './components/DevicePanel';
import ConfigPanel from './components/ConfigPanel';

import { Project } from './project';
import { PortInfo } from './ports/port-info';
import {
  DeviceConfig,
  UnsupportedDeviceConfig,
  SupportedDeviceConfig,
} from './hardware-config';
import { DeviceDriver } from './driver-types';

import './styles/App.global.css';

export default function App() {
  /**
   * Current project. `project` is never mutated locally, but instead passed
   * to the backend for mutation, then reloaded here.
   */
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

      if (Array.from(drivers.keys()).includes(portInfo.name)) {
        device = SupportedDeviceConfig.fromDriver(
          portInfo.id,
          portInfo.occurrenceNumber,
          drivers.get(portInfo.name)!
        );
      } else {
        device = new UnsupportedDeviceConfig(
          portInfo.id,
          portInfo.name,
          portInfo.occurrenceNumber
        );
      }
    }

    setActiveDevice(device);
  }, [ports, project, selectedId, drivers]);

  /* Receive drivers from the backend */
  useEffect(() => {
    const cb = (_e: IpcRendererEvent, d: [string, DeviceDriver][]) => {
      setDrivers(new Map(d));
    };

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

  /* Listen to changes to current project */
  useEffect(() => {
    const cb = (_e: Event, projString: string) => {
      const proj = Project.fromJSON(projString);
      setProject(proj);
    };

    ipcRenderer.on('project', cb);
    return () => {
      ipcRenderer.removeListener('project', cb);
    };
  }, [ports]);

  return (
    <>
      <title>{project.name}</title>
      <TitleBar title={project.name} />
      <NavBar
        ports={ports}
        drivers={drivers}
        project={project}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
      />
      <DevicePanel
        device={activeDevice}
        project={project}
        selectedInputs={selectedInputs}
        setSelectedInputs={setSelectedInputs}
      />
      <ConfigPanel
        device={activeDevice}
        project={project}
        selectedInputs={selectedInputs}
      />
    </>
  );
}
