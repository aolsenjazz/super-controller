import { useEffect } from 'react';

import { DeviceConfig } from '@shared/hardware-config';
import { DrivenPortInfo } from '@shared/driven-port-info';
import { Project } from '@shared/project';

import DeviceListItem from './DeviceListItem';

const drivers = window.driverService.getDrivers();

/**
 * Merge available hardware portInfos with device configurations to make
 * a master list.
 *
 * @param portInfos The available ports
 * @param deviceConfigs The device configurations in the current project
 * @returns A sorted list of all connected, available, and disconnected ports/devices.
 */
function sortPorts(portInfos: DrivenPortInfo[], deviceConfigs: DeviceConfig[]) {
  // sort by ID descending
  const sortAlg = (a: DrivenPortInfo, b: DrivenPortInfo) =>
    a.id > b.id ? 1 : -1;

  const connectedConfigured = portInfos.filter((info) => {
    return deviceConfigs.filter((config) => config.id === info.id).length > 0;
  });
  connectedConfigured.sort(sortAlg);

  // find and sort connected, but unconfigured, devices
  const connectedUnconfigured = portInfos.filter((info) => {
    return deviceConfigs.filter((config) => config.id === info.id).length === 0;
  });
  connectedUnconfigured.sort(sortAlg);

  const unconnectedConfigured = deviceConfigs
    .filter((config) => {
      return portInfos.filter((info) => config.id === info.id).length === 0;
    })
    .map((config) => {
      let d = drivers.get(config.name);

      d = d === undefined ? drivers.get('Anonymous')! : d;
      return new DrivenPortInfo(config.name, config.siblingIndex, false, d);
    });
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
  ports: DrivenPortInfo[];
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
    const config = project.getDevice(info.id);

    return (
      <DeviceListItem
        key={info.id}
        id={info.id}
        driver={info.driver}
        onClick={() => setSelectedId(info.id)}
        active={selectedId === info.id}
        connected={info.connected}
        configured={config !== undefined}
        name={info.name}
        nickname={config?.nickname}
        siblingIndex={info.siblingIndex}
      />
    );
  });

  return (
    <div id="device-list" className="top-level">
      {elements}
    </div>
  );
}
