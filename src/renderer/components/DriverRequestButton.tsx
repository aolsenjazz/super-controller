import { useCallback } from 'react';

const { HostService } = window;

type PropTypes = {
  deviceName?: string;
};

export default function DriverRequestButton(props: PropTypes) {
  const { deviceName } = props;

  const click = useCallback(() => {
    HostService.sendDeviceRequest(deviceName);
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
