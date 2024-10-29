import { useCallback } from 'react';

import { DRIVERS } from '@shared/drivers';

import DriverRequestButton from '../../../DriverRequestButton';
import IosSelect from '../../../IosSelect';

const drivers = new Map(Array.from(DRIVERS.entries()));

const { DeviceConfigService } = window;

type PropTypes = {
  name: string;
  siblingIndex: number;
};

export default function LinuxNotConfigured(props: PropTypes) {
  const { name, siblingIndex } = props;

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = '';

  const onChange = useCallback(
    (v: string) => {
      DeviceConfigService.addDevice(name, siblingIndex, v);
    },
    [name, siblingIndex]
  );

  return (
    <div id="adapter-view-container">
      <div>
        <p className="label">Select Device: </p>
        <IosSelect
          valueList={valueList}
          labelList={labelList}
          value={value}
          onChange={onChange}
          placeholder="Choose your device"
        />
      </div>
      <DriverRequestButton />
    </div>
  );
}
