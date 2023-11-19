import { DeviceDriver } from '@shared/driver-types';

import DeviceLayout from './DeviceLayout';

type PropTypes = {
  driver: DeviceDriver;
};

export default function NoninteractiveDeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { driver } = props;

  return (
    <DeviceLayout
      driver={driver}
      onClick={() => {}}
      selectedInputs={[]}
      deviceConfig={config}
    />
  );
}
