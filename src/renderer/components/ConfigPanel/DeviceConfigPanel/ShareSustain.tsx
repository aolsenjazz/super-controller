import { DeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';

import ShareSustainLine from './ShareSustainLine';

const { projectService } = window;

function disambiguatedNickname(
  nickname: string,
  name: string,
  siblingIndex: number
) {
  if (nickname === name) {
    return siblingIndex === 0 ? name : `${name} (${siblingIndex})`;
  }

  return nickname;
}

type PropTypes = {
  project: Project;
  config: DeviceConfig;
  setProject: (p: Project) => void;
};

/**
 * List of all devices eligible to share sustain events
 *
 * @param props Component props
 * @param props.project Current project
 * @param props.config Device configuration
 * @param props.setProject updates the project in frontend
 */
export default function ShareSustain(props: PropTypes) {
  const { config, project, setProject } = props;

  // get all devices which aren't this device
  const shareableDevices = project.devices.filter(
    (dev) => dev.id !== config.id
  );

  if (shareableDevices.length === 0) return null;

  return (
    <>
      <h4>Share sustain:</h4>
      {shareableDevices.map((dev) => {
        return (
          <ShareSustainLine
            name={disambiguatedNickname(
              dev.nickname,
              dev.portName,
              dev.siblingIndex
            )}
            key={dev.id}
            value={config.sharingWith(dev.id)}
            onChange={(checked) => {
              if (checked) config.shareWith(dev.id);
              else config.stopSharing(dev.id);

              projectService.updateDevice(stringify(config)); // send update to the backend
              setProject(new Project(project.devices)); // update in frontend
            }}
          />
        );
      })}
    </>
  );
}
