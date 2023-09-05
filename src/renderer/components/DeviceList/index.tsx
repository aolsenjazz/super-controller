import { useEffect } from 'react';

import { PortInfo } from '@shared/port-info';
import { DeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { DRIVERS } from '@shared/drivers';

import DeviceListItem from './DeviceListItem';

/**
 * Merge available hardware portInfos with device configurations to make
 * a master list.
 *
 * @param portInfos The available ports
 * @param deviceConfigs The device configurations in the current project
 * @returns A sorted list of all connected, available, and disconnected ports/devices.
 */
function sortPorts(portInfos: PortInfo[], deviceConfigs: DeviceConfig[]) {
  // sort by ID descending
  const sortAlg = (a: PortInfo, b: PortInfo) => (a.id > b.id ? 1 : -1);

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
      return new PortInfo(config.portName, config.siblingIndex, false);
    });
  unconnectedConfigured.sort(sortAlg);

  return connectedConfigured
    .concat(connectedUnconfigured)
    .concat(unconnectedConfigured);
}

type PropTypes = {
  ports: PortInfo[];
  project: Project;
  setSelectedPort: (selectedId: PortInfo | undefined) => void;
  selectedPort: PortInfo | undefined;
};
export default function DeviceList(props: PropTypes) {
  const { ports, setSelectedPort, selectedPort, project } = props;
  const sorted = sortPorts(ports, project.devices);

  // Updated selectedId when anything changes
  useEffect(() => {
    if (selectedPort === undefined) {
      // there are were no devices last render, update in case there are new devices
      const port = sorted.length > 0 ? sorted[0] : undefined;
      setSelectedPort(port);
    } else {
      // find out if the currently selected ID has a corresponding config/port
      const inPorts =
        ports.filter((port) => port.id === selectedPort.id).length > 0;
      const inProject =
        project.devices.filter((device) => device.id === selectedPort.id)
          .length > 0;
      const isPortRepresented = inPorts || inProject;

      // if not, change the selectedID
      if (!isPortRepresented) {
        const newPort = sorted.length === 0 ? undefined : sorted[0];
        setSelectedPort(newPort);
      }
    }
  }, [project, ports, setSelectedPort, selectedPort, sorted]);

  // Assemble the JSX for device list
  const elements = sorted.map((info) => {
    const config = project.getDevice(info.id);
    const driver = DRIVERS.get(info.name) || DRIVERS.get('Anonymous')!;

    return (
      <DeviceListItem
        key={info.id}
        id={info.id}
        driver={driver}
        onClick={() => setSelectedPort(info)}
        active={selectedPort?.id === info.id}
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
