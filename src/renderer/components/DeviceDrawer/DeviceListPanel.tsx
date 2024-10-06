import { useSelector } from 'react-redux';

import { setId } from '@features/selected-device-id/selected-device-id-slice';

import { selectUnifiedDevices } from '@selectors/unified-devices-selector';
import { useAppDispatch } from '@hooks/use-app-dispatch';

import DeviceListItem from './DeviceListItem';
import type { UnifiedDevice } from '../../unified-device';

type PropTypes = {
  selectedDevice: UnifiedDevice;
};

export default function DeviceListPanel(props: PropTypes) {
  const { selectedDevice } = props;

  const dispatch = useAppDispatch();
  const unifiedDevices = useSelector(selectUnifiedDevices);

  return (
    <div className="device-list-panel">
      {unifiedDevices.map((d) => {
        return (
          <DeviceListItem
            key={d.id}
            deviceId={d.id}
            selected={selectedDevice.id === d.id}
            onClick={() => dispatch(setId(d.id))}
            config={d.config}
            connectionDetails={d.connectionDetails}
          />
        );
      })}
    </div>
  );
}
