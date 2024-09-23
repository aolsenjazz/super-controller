import React from 'react';
import ControlledInput from './ControlledInput';

type PropTypes = {
  name: string;
  nickname: string;
  onNicknameChange: (newNickname: string) => void;
  deactivated: boolean;
};

export default function NicknameSubpanel({
  name,
  nickname,
  onNicknameChange,
  deactivated,
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
