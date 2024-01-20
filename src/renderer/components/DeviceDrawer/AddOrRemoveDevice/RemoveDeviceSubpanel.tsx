import { useCallback, useState } from 'react';

const { ConfigService } = window;

type PropTypes = {
  nickname: string;
  id: string;
};

export default function RemoveDeviceSubpanel({ nickname, id }: PropTypes) {
  // require use to type in device name before deleting config
  const [confirm, setConfirm] = useState<string>('');
  const [confirmClass, setConfirmClass] = useState<string>('');
  const confirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // provide visual feedback on correctness of string
    if (val.length === 0) setConfirmClass('');
    else if (val === nickname) setConfirmClass('border-green');
    else setConfirmClass('border-red');

    setConfirm(val);
  };

  const onDelete = useCallback(() => {
    ConfigService.removeDevice(id);
  }, [id]);

  const confirmEquals = confirm === nickname;

  return (
    <div id="remove-device">
      <input
        className={confirmClass}
        placeholder={nickname}
        onChange={confirmChange}
      />
      <button
        type="button"
        className={`${confirmEquals ? 'hoverable' : 'disabled'}`}
        disabled={confirm !== nickname}
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}
