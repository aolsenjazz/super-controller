import { AdapterDeviceConfig } from '@shared/hardware-config';

import HelpTip from '../HelpTip';
import DriverRequestButton from '../DriverRequestButton';
import BasicSelect from './BasicSelect';

const { driverService } = window;

type PropTypes = { config: AdapterDeviceConfig };

const tipBody = `When using a 5-pin adapter, only the adapter is visible to SuperController. Select your connected 5-pin device from the dropdown below.

   Don't see your device? Request it using the button below.`;

export default function AdapterView(props: PropTypes) {
  const { config } = props;

  const drivers = driverService.getFivePinDrivers();

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = 'Option 1';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChange = (_v: string | number) => {};

  return (
    <div id="adapter-view-container">
      <h2>{config.name}</h2>
      <div className="subtitle-container">
        <h3>5-pin adapter</h3>
        <HelpTip body={tipBody} />
      </div>
      <div>
        <p className="label">Select Device: </p>
        <BasicSelect
          valueList={valueList}
          labelList={labelList}
          value={value}
          onChange={onChange}
        />
      </div>
      <DriverRequestButton />
    </div>
  );
}
