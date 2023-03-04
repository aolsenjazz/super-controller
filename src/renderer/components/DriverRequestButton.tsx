import { useCallback } from 'react';

const { hostService } = window;

type PropTypes = {
  deviceName?: string;
};

export default function DriverRequestButton(props: PropTypes) {
  const { deviceName } = props;

  const click = useCallback(() => {
    hostService.request(deviceName);
  }, [deviceName]);

  return (
    <button className="driver-request" onClick={click} type="submit">
      Request Driver
    </button>
  );
}

DriverRequestButton.defaultProps = {
  deviceName: undefined,
};
