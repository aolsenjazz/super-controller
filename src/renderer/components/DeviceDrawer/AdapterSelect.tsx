import { DRIVERS } from '@shared/drivers';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

import BasicSelect from '../BasicSelect';

const fivePins = Array.from(DRIVERS.entries())
  .filter(([_k, v]) => v.type === '5pin')
  .map(([k]) => k);

const { DeviceConfigService } = window;

type PropTypes = {
  device: DeviceConfigDTO;
};

export default function AdapterSelect(props: PropTypes) {
  const { device } = props;

  const value = device.child?.driverName || '';

  const onChange = (v: string) => {
    DeviceConfigService.setChild(device.id, v);
  };
  return (
    <div id="adapter-select">
      <label htmlFor="adapter-select">
        Select Device:
        <BasicSelect
          valueList={fivePins}
          labelList={fivePins}
          value={value}
          onChange={onChange}
          placeholder="Choose your device"
        />
      </label>
    </div>
  );
}
