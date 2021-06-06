import React, { useEffect } from 'react';

import DeviceNavItem from './DeviceNavItem';

import { SupportedDeviceConfig } from '../hardware-config';
import { DeviceDriver } from '../driver-types';
import { PortInfo, PortIdentifier } from '../ports/port-info';
import { Project } from '../project';

/**
 * Merge available hardware ports (portInfos) with device configurations to make
 * a master list.
 */
function sortPorts(
  portInfos: PortInfo[],
  deviceConfigs: SupportedDeviceConfig[]
) {
  const sortAlg = (a: PortIdentifier, b: PortIdentifier) =>
    a.id > b.id ? 1 : -1;

  const connectedConfigured = deviceConfigs
    .filter((config) => {
      return portInfos.filter((info) => info.id === config.id).length > 0;
    })
    .map(
      (config) =>
        new PortInfo(config.id, config.nickname, config.occurrenceNumber, true)
    );
  connectedConfigured.sort(sortAlg);

  const connectedUnconfigured = portInfos.filter((info) => {
    return deviceConfigs.filter((dev) => dev.id === info.id).length === 0;
  });
  connectedUnconfigured.sort(sortAlg);

  const unconnectedConfigured = deviceConfigs
    .filter((config) => {
      return portInfos.filter((info) => info.id === config.id).length === 0;
    })
    .map(
      (config) =>
        new PortInfo(config.id, config.nickname, config.occurrenceNumber, false)
    );
  unconnectedConfigured.sort(sortAlg);

  return connectedConfigured
    .concat(connectedUnconfigured)
    .concat(unconnectedConfigured);
}

type PropTypes = {
  ports: PortInfo[];
  project: Project;
  setSelectedId: (selectedId: string | undefined) => void;
  selectedId: string | undefined;
  drivers: Map<string, DeviceDriver>;
};

/**
 * Displays available ports + configurations, and manages selectedId.
 */
export default function NavBar(props: PropTypes) {
  const { ports, setSelectedId, selectedId, project, drivers } = props;
  const sorted = sortPorts(ports, project.devices);

  useEffect(() => {
    if (selectedId === undefined) {
      const id = sorted.length > 0 ? sorted[0].id : undefined;
      setSelectedId(id);
    } else {
      const inPorts = ports.filter((port) => port.id === selectedId).length > 0;
      const inProject =
        project.devices.filter((device) => device.id === selectedId).length > 0;
      const isPortRepresented = inPorts || inProject;

      if (!isPortRepresented) {
        const newId = sorted.length === 0 ? undefined : sorted[0].id;
        setSelectedId(newId);
      }
    }
  }, [project, ports, setSelectedId, selectedId, sorted]);

  const elements = sorted.map((info) => {
    const configured = project.getDevice(info.id) !== null;

    return (
      <DeviceNavItem
        key={info.id}
        id={info.id}
        drivers={drivers}
        onClick={() => setSelectedId(info.id)}
        active={selectedId === info.id}
        connected={info.connected}
        configured={configured}
        name={info.name}
        occurenceNumber={info.occurrenceNumber}
      />
    );
  });

  return (
    <div id="nav-bar" className="top-level">
      {elements}
    </div>
  );
}
