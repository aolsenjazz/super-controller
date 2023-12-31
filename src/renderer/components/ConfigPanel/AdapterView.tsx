import { DRIVERS } from '@shared/drivers';
import { DeviceStub } from '@shared/device-stub';

import HelpTip from '../HelpTip';
import DriverRequestButton from '../DriverRequestButton';
import BasicSelect from '../BasicSelect';

// TODO: is this supposed to be a set... no reason to be a map
const fivePins = new Map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Array.from(DRIVERS.entries()).filter(([_k, d]) => d.type === '5pin')
);

const { ConfigService } = window;

type PropTypes = {
  device: DeviceStub;
};

const tipBody = `When using a 5-pin adapter, only the adapter is visible to SuperController. Select your connected 5-pin device from the dropdown below.

   Don't see your device? Request it using the button below.`;

export default function AdapterView(props: PropTypes) {
  const { device } = props;

  const valueList = Array.from(fivePins.keys());
  const labelList = Array.from(fivePins.keys());
  const value = '';

  const onChange = (v: string | number) => {
    ConfigService.addDevice(
      device.name,
      device.siblingIndex,
      device.name,
      v as string
    );
  };

  return (
    <div id="adapter-view-container">
      <h2>{device.name}</h2>
      <div className="subtitle-container">
        <h3>5-pin adapter</h3>
        <HelpTip body={tipBody} transform="translateX(-300px)" />
      </div>
      <div>
        <p className="label">Select Device: </p>
        <BasicSelect
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
