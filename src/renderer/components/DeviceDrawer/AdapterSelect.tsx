import { DRIVERS } from '@shared/drivers';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

import BasicSelect from '../BasicSelect';

const fivePins = Array.from(DRIVERS.entries())
  .filter(([_k, v]) => v.type === '5pin')
  .map(([k]) => k);

const { DeviceConfigService } = window;

type PropTypes = {
  deviceConfig: DeviceConfigDTO;
};

export default function AdapterSelect(props: PropTypes) {
  const { deviceConfig } = props;

  const value = deviceConfig.child?.driverName || '';

  const onChange = (v: string) => {
    DeviceConfigService.setChild(deviceConfig.id, v);
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
