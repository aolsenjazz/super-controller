import { useCallback } from 'react';

const { driverService } = window;

type PropTypes = {
  deviceName?: string;
};

export default function DriverRequestButton(props: PropTypes) {
  const { deviceName } = props;

  const click = useCallback(() => {
    driverService.request(deviceName);
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
