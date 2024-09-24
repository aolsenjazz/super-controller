import React from 'react';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

import ControlledInput from '../ControlledInput';
import AdapterDetailsSubpanel from '../DeviceDrawer/AdapterDetailsSubpanel';
import AdapterSelect from '../DeviceDrawer/AdapterSelect';

import './NicknameSubpanel.css';

type PropTypes = {
  name: string;
  nickname: string;
  onNicknameChange: (newNickname: string) => void;
  deactivated: boolean;
  isAdapter: boolean;
  device: DeviceConfigDTO;
};

export default function NicknameSubpanel({
  name,
  nickname,
  onNicknameChange,
  deactivated,
  isAdapter,
  device,
}: PropTypes) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNicknameChange(event.target.value);
  };

  return (
    <div
      className={`subpanel nickname-subpanel ${
        deactivated ? 'deactivated' : ''
      }`}
    >
      <div className="nickname-display">
        <h1>{name}</h1>
      </div>
      {isAdapter && (
        <>
          <AdapterDetailsSubpanel /> <AdapterSelect device={device} />
        </>
      )}
      <label htmlFor="nickname-input">
        Nickname:
        <ControlledInput
          id="nickname-input"
          type="text"
          value={nickname}
          onChange={handleInputChange}
        />
      </label>
    </div>
  );
}
