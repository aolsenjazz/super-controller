import { createSelector } from 'reselect';
import { selectSelectedDeviceId } from './selected-device-id-selector';
import { selectUnifiedDevices } from './unified-devices-selector';

export const selectSelectedDevice = createSelector(
  [selectUnifiedDevices, selectSelectedDeviceId],
  (devices, id) => {
    return devices.find((d) => d.id === id);
  },
);
