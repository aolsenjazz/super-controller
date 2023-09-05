import { configFromDriver } from '@shared/hardware-config';
import { stringify } from '@shared/util';
import { Project } from '@shared/project';
import { DRIVERS } from '@shared/drivers';
import { PortInfo } from '@shared/port-info';

import DriverRequestButton from '../../DriverRequestButton';
import BasicSelect from '../../BasicSelect';

const drivers = new Map(Array.from(DRIVERS.entries()));

const { projectService } = window;

/**
 * Inform the current user that the device isn't configured, and allow them to configure
 *
 * @param props Component props
 * @param props.config Configuration of the current device
 */
export default function LinuxNotConfigured(props: {
  port: PortInfo;
  project: Project;
  setProject: (p: Project) => void;
}) {
  const { port, project, setProject } = props;

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = '';

  const onChange = (v: string | number) => {
    const driver = DRIVERS.get(v as string);
    const config = configFromDriver(port.name, port.siblingIndex, driver!);

    project.addDevice(config);
    setProject(new Project(project.devices)); // update in frontend
    projectService.addDevice(stringify(config)); // update in backend
  };

  return (
    <div id="adapter-view-container">
      <div>
        <p className="label">Select Device: </p>
        <BasicSelect
          valueList={valueList}
          labelList={labelList}
          value={value}
          onChange={onChange}
          placeholder="Choose your device"
        />
      </div>
      <DriverRequestButton />
    </div>
  );
}
