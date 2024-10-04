import { useCallback } from 'react';

const { DeviceConfigService } = window;

type PropTypes = {
  name: string;
  siblingIndex: number;
};

export default function BasicNotConfigured(props: PropTypes) {
  const { name, siblingIndex } = props;

  const onClick = useCallback(() => {
    DeviceConfigService.addDevice(name, siblingIndex);
  }, [name, siblingIndex]);

  return (
    <div className="message not-configured">
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
