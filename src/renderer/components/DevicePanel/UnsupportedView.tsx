import { useCallback } from 'react';

const { driverService } = window;

type PropTypes = {
  deviceName: string;
};

/**
 * Tell the user that this device isn't supported
 */
export default function UnsupportedView(props: PropTypes) {
  const { deviceName } = props;

  const click = useCallback(() => {
    driverService.request(deviceName);
  }, [deviceName]);

  return (
    <div id="unsupported-device">
      <p>No preview available.</p>
      <div className="help-tip">
        <p>
          This device doesn&apos;t have a driver yet. You can still override
          events manually and set its nickname in the configuration panel.
        </p>
      </div>
      <button className="driver-request" onClick={click} type="submit">
        Request Driver
      </button>
    </div>
  );
}
