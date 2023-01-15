import { useCallback } from 'react';

import { SupportedDeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';

const { projectService } = window;

/**
 * Inform the current user that the device isn't configured, and allow them to configure
 *
 * @param props Component props
 * @param props.config Configuration of the current device
 */
export default function NotConfigured(props: {
  config: SupportedDeviceConfig;
  project: Project;
  setProject: (p: Project) => void;
}) {
  const { config, project, setProject } = props;

  const onClick = useCallback(() => {
    project.addDevice(config);
    setProject(new Project(project.devices));
    projectService.addDevice(config.toJSON(false));
  }, [config, project, setProject]);

  return (
    <div className="center-vert message">
      <p>Device is not yet configured.</p>
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
