import { useCallback } from 'react';

import { configFromDriver } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';
import { PortInfo } from '@shared/port-info';
import { DRIVERS } from '@shared/drivers';

const { projectService } = window;

/**
 * Inform the current user that the device isn't configured, and allow them to configure
 *
 * @param props Component props
 * @param props.config Configuration of the current device
 */
export default function OSXNotConfigured(props: {
  port: PortInfo;
  project: Project;
  setProject: (p: Project) => void;
}) {
  const { port, project, setProject } = props;

  const onClick = useCallback(() => {
    const driver = DRIVERS.get(port.name)!;
    const config = configFromDriver(port.name, port.siblingIndex, driver);

    project.addDevice(config);
    setProject(new Project(project.devices));
    projectService.addDevice(stringify(config));
  }, [port, project, setProject]);

  return (
    <div className="message not-configured">
      <p>Device is not yet configured.</p>
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
