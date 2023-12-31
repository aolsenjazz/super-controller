import React, { useCallback, useState } from 'react';

import { ConfigStub } from '@shared/hardware-config/device-config';

import ShareSustain from './ShareSustain';

const { ConfigService } = window;

type PropTypes = {
  config: ConfigStub;
};

export default function DeviceConfigPanel(props: PropTypes) {
  const { config } = props;

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      config.nickname = e.target.value;
      ConfigService.updateDevice(config);
    },
    [config]
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
    ConfigService.removeDevice(config.id);
  }, [config]);

  return (
    <div id="device-config">
      <h3>Device Settings</h3>
      <p className="label">Nickname:</p>
      <input id="nickname" value={config.nickname} onChange={onNameChange} />
      <ShareSustain config={config} />
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
