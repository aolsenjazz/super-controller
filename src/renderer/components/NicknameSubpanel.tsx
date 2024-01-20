import React from 'react';

type PropTypes = {
  name: string;
  nickname: string;
  onNicknameChange: (newNickname: string) => void;
};

export default function NicknameSubpanel({
  name,
  nickname,
  onNicknameChange,
}: PropTypes) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNicknameChange(event.target.value);
  };

  return (
    <div className="nickname-subpanel">
      <div className="nickname-display">
        <h1>{nickname || name}</h1>
      </div>
      <label htmlFor="nickname-input">
        Nickname:
        <input
          id="nickname-input"
          type="text"
          value={nickname}
          onChange={handleInputChange}
          placeholder={name}
        />
      </label>
    </div>
  );
}
