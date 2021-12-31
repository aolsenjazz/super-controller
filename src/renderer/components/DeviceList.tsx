import { useEffect } from 'react';

import {
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
} from '@shared/hardware-config';
import { PortInfo, PortIdentifier } from '@shared/port-info';
import { Project } from '@shared/project';

import { anonymousDriver } from '../anonymous-device';

import DeviceListItem from './DeviceListItem';

const { driverService } = window;
const drivers = driverService.getDrivers();

/**
 * Merge available hardware portInfos with device configurations to make
 * a master list.
 *
 * @param portInfos The available ports
 * @param deviceConfigs The device configurations in the current project
 * @returns A sorted list of all connected, available, and disconnected ports/devices.
 */
function sortPorts(
  portInfos: PortInfo[],
  deviceConfigs: (SupportedDeviceConfig | AnonymousDeviceConfig)[]
) {
  // sort by ID descending
  const sortAlg = (a: PortIdentifier, b: PortIdentifier) =>
    a.id > b.id ? 1 : -1;

  // sort connected devices
  const connectedConfigured = deviceConfigs
    .filter((config) => {
      return portInfos.filter((info) => info.id === config.id).length > 0;
    })
    .map(
      (config) =>
        new PortInfo(config.id, config.nickname, config.occurrenceNumber, true)
    );
  connectedConfigured.sort(sortAlg);

  // find and sort connected, but unconfigured, devices
  const connectedUnconfigured = portInfos.filter((info) => {
    return deviceConfigs.filter((dev) => dev.id === info.id).length === 0;
  });
  connectedUnconfigured.sort(sortAlg);

  // sort configured, but disconnected, devices
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

/**
 * @callback setSelectedId
 * @param selectedId The id of the active device
 */

type PropTypes = {
  ports: PortInfo[];
  project: Project;
  setSelectedId: (selectedId: string | undefined) => void;
  selectedId: string | undefined;
};

/**
 * Displays available ports + configurations, and manages selectedId.
 *
 * @param props Component props
 * @param props.ports The available ports
 * @param props.project The current project
 * @param props.setSelectedId Sets the current device ID
 * @param props.selectedId The active device ID
 */
export default function DeviceList(props: PropTypes) {
  const { ports, setSelectedId, selectedId, project } = props;
  const sorted = sortPorts(ports, project.devices);

  // Updated selectedId when anything changes
  useEffect(() => {
    if (selectedId === undefined) {
      // there are were no devices last render, update in case there are new devices
      const id = sorted.length > 0 ? sorted[0].id : undefined;
      setSelectedId(id);
    } else {
      // find out if the currently selected ID has a corresponding config/port
      const inPorts = ports.filter((port) => port.id === selectedId).length > 0;
      const inProject =
        project.devices.filter((device) => device.id === selectedId).length > 0;
      const isPortRepresented = inPorts || inProject;

      // if not, change the selectedID
      if (!isPortRepresented) {
        const newId = sorted.length === 0 ? undefined : sorted[0].id;
        setSelectedId(newId);
      }
    }
  }, [project, ports, setSelectedId, selectedId, sorted]);

  // Assemble the JSX for device list
  const elements = sorted.map((info) => {
    const configured = project.getDevice(info.id) !== null;
    let driver = drivers.get(info.name);
    if (!driver) driver = anonymousDriver;

    return (
      <DeviceListItem
        key={info.id}
        id={info.id}
        driver={driver}
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
