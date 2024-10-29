import { createSelector } from 'reselect';

import { selectUnifiedDevices } from './unified-devices-selector';
import { selectId } from '../features/selected-device-id/selected-device-id-slice';

export const selectSelectedDeviceId = createSelector(
  [selectUnifiedDevices, selectId],
  (devices, selectedId) => {
    const device = devices.find((d) => d.id === selectedId);

    if (device) return selectedId;

    return devices.length > 0 ? devices[0].id : null;
  },
);
