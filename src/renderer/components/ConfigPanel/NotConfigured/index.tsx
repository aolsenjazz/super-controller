import { PortInfo } from '@shared/port-info';
import { Project } from '@shared/project';

import LinuxNotConfigured from './LinuxNotConfigured';
import OSXNotConfigured from './OSXNotConfigured';

const { hostService } = window;

type Host =
  | 'linux'
  | 'win32'
  | 'sunos'
  | 'openbsd'
  | 'freebsd'
  | 'darwin'
  | 'aix';

/**
 * Inform the current user that the device isn't configured, and allow them to configure
 *
 * @param props Component props
 * @param props.config Configuration of the current device
 */
export default function NotConfigured(props: {
  port: PortInfo;
  project: Project;
  setProject: (p: Project) => void;
}) {
  const { port, project, setProject } = props;

  const host: Host = hostService.getHost();

  return (
    <>
      {host === 'darwin' ? (
        <OSXNotConfigured
          port={port}
          setProject={setProject}
          project={project}
        />
      ) : (
        <LinuxNotConfigured
          port={port}
          setProject={setProject}
          project={project}
        />
      )}
    </>
  );
}
