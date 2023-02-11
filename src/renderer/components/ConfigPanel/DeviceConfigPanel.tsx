import React, { useCallback, useState } from 'react';

import { SupportedDeviceConfig } from '@shared/hardware-config';
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

/**
 * List of all devices eligible to share sustain events
 *
 * @param props Component props
 * @param props.project Current project
 * @param props.config Device configuration
 * @param props.setProject updates the project in frontend
 */
function ShareSustain(props: PropTypes) {
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
              dev.name,
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

type PropTypes = {
  project: Project;
  config: SupportedDeviceConfig;
  setProject: (p: Project) => void;
};

/**
 * Panel for device-specific configuration
 *
 * @param props Component props
 * @param props.project Current project
 * @param props.config Device configuration
 * @param props.setProject Sets the project in frontend
 */
export default function DeviceConfigPanel(props: PropTypes) {
  const { project, config, setProject } = props;

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      config.nickname = e.target.value;

      projectService.updateDevice(stringify(config)); // send update to the backend
      setProject(new Project(project.devices)); // update in frontend
    },
    [config, project.devices, setProject]
  );

  // require use to type in device name before deleting config
  const [confirm, setConfirm] = useState<string>('');
  const [confirmClass, setConfirmClass] = useState<string>('');
  const confirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // provide visual feedback on correctness of string
    if (val.length === 0) setConfirmClass('');
    else if (val === config.nickname) setConfirmClass('border-green');
    else setConfirmClass('border-red');

    setConfirm(val);
  };

  const confirmEquals = confirm === config.nickname;

  const onDelete = useCallback(() => {
    project.removeDevice(config);
    setProject(new Project(project.devices));
    projectService.removeDevice(config.id);
  }, [config, project, setProject]);

  return (
    <div id="device-config">
      <h3>Device Settings</h3>
      <p className="label">Nickname:</p>
      <input id="nickname" value={config.nickname} onChange={onNameChange} />
      <ShareSustain config={config} project={project} setProject={setProject} />
      <h4>Delete Configuration:</h4>
      <div id="remove-device">
        <p>
          To delete this configuration, enter the nickname and press
          &quot;Delete.&quot;
        </p>
        <input
          className={confirmClass}
          placeholder={config.nickname}
          onChange={confirmChange}
        />
        <button
          type="button"
          className={`${confirmEquals ? 'hoverable' : ''}`}
          disabled={confirm !== config.nickname}
          onClick={onDelete}
          style={{ opacity: confirmEquals ? 1 : 0.5 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
