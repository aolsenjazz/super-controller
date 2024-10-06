import { useSelector } from 'react-redux';

import { selectSelectedDevice } from '@selectors/selected-device-selector';

import NoDevicesView from './NoDevicesView';
import DevicePanelContent from './DevicePanelContent';

export default function DevicePanelContainer() {
  const selectedDevice = useSelector(selectSelectedDevice);

  return (
    <div id="device-panel" className="top-level">
      {selectedDevice ? (
        <DevicePanelContent
          config={selectedDevice.config}
          connectionDetails={selectedDevice.connectionDetails}
        />
      ) : (
        <NoDevicesView />
      )}
    </div>
  );
}
