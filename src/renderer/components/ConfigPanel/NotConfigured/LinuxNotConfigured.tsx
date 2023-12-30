import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { DRIVERS } from '@shared/drivers';
import { useDeviceStub } from '@hooks/use-device-stub';

import DriverRequestButton from '../../DriverRequestButton';
import BasicSelect from '../../BasicSelect';

const drivers = new Map(Array.from(DRIVERS.entries()));

const { projectService } = window;

export default function LinuxNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceStub } = useDeviceStub(selectedDevice || '');

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = '';

  const onChange = useCallback(
    (v: string) => {
      projectService.addDevice(deviceStub!.name, deviceStub!.siblingIndex, v);
    },
    [deviceStub]
  );

  return (
    <div id="adapter-view-container">
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
