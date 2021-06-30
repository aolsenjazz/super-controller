import React, { useCallback, useState } from 'react';

import ShareSustainLine from './ShareSustainLine';

import { ipcRenderer } from '../../ipc-renderer';
import { SupportedDeviceConfig } from '../../hardware-config';
import { Project } from '../../project';

/**
 * List of all devices eligible to share sustain events
 *
 * @param { object } props Component props
 * @param { Project } props.project Current project
 * @param { SupportedDeviceConfig } props.config Device configuration
 */
function ShareSustain(props: PropTypes) {
  const { config, project } = props;

  // get all devices which are eligible for sharing sustain
  const shareableDevices = project.devices.filter(
    (dev) => dev.id !== config.id && dev.keyboardDriver !== undefined
  );

  if (config.keyboardDriver === undefined || shareableDevices.length === 0)
    return null;

  return (
    <>
      <h4>Share sustain:</h4>
      {shareableDevices.map((dev) => {
        return (
          <ShareSustainLine
            name={dev.nickname}
            key={dev.id}
            value={config.sharingWith(dev.id)}
            onChange={(checked) => {
              if (checked) {
                config.shareWith(dev.id);
              } else {
                config.stopSharing(dev.id);
              }

              ipcRenderer.sendProject(project, true);
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
};

/**
 * Panel for device-specific configuration
 *
 * @param { object } props Component props
 * @param { Project } props.project Current project
 * @param { SupportedDeviceConfig } props.config Device configuration
 */
export default function DeviceConfigPanel(props: PropTypes) {
  const { project, config } = props;

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      config.nickname = e.target.value;
      ipcRenderer.sendProject(project, true);
    },
    [config, project]
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

  const onDelete = useCallback(() => ipcRenderer.removeDevice(config.id), [
    config,
  ]);

  return (
    <div id="device-config">
      <h3>Device Settings</h3>
      <p>Nickname:</p>
      <input id="nickname" value={config.nickname} onChange={onNameChange} />
      <ShareSustain config={config} project={project} />
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
