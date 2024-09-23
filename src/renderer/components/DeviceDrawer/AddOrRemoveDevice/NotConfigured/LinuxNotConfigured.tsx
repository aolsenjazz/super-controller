import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { DRIVERS } from '@shared/drivers';
import { useDeviceConnectionDetails } from '@hooks/use-device-connection-details';

import DriverRequestButton from '../../../DriverRequestButton';
import BasicSelect from '../../../BasicSelect';

const drivers = new Map(Array.from(DRIVERS.entries()));

const { ProjectConfigService } = window;

export default function LinuxNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceConnectionDetails } = useDeviceConnectionDetails(
    selectedDevice || ''
  );

  const valueList = Array.from(drivers.keys());
  const labelList = Array.from(drivers.keys());
  const value = '';

  const onChange = useCallback(
    (v: string) => {
      ProjectConfigService.addDevice(
        deviceConnectionDetails!.name,
        deviceConnectionDetails!.siblingIndex,
        v
      );
    },
    [deviceConnectionDetails]
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
