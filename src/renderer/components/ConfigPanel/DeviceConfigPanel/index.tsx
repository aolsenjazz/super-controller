import React, { useCallback, useState } from 'react';

import { DeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';

import ShareSustain from './ShareSustain';

const { projectService } = window;

type PropTypes = {
  project: Project;
  config: DeviceConfig;
  setProject: (p: Project) => void;
};

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
          className={`${confirmEquals ? 'hoverable' : 'disabled'}`}
          disabled={confirm !== config.nickname}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
