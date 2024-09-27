import { useCallback, useMemo } from 'react';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useDeviceConfig } from '@hooks/use-device-config';
import { importDeviceSubcomponent } from '@plugins/plugin-loader';

import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';
import AdapterDetailsSubpanel from './AdapterDetailsSubpanel';
import AdapterSelect from './AdapterSelect';
import ControlledInput from '../ControlledInput';

const { DeviceConfigService, MenuService, HostService } = window;

type PropTypes = {
  selectedDevice: string;
};

export default function DeviceDetailsPanel(props: PropTypes) {
  const { selectedDevice } = props;

  const { deviceConfig } = useDeviceConfig(selectedDevice);

  const configured = deviceConfig !== undefined;
  const isAdapter = deviceConfig?.type === 'adapter';

  const deviceConnectionDetails = useMemo(
    () => HostService.getDeviceConnectionDetails(selectedDevice),
    [selectedDevice]
  );

  const deviceName =
    deviceConnectionDetails?.name || deviceConfig?.portName || '';
  const deviceNickname = deviceConfig?.nickname || '';

  const onChange = useCallback(
    (n: string) => {
      const newConfig: DeviceConfigDTO = {
        ...deviceConfig!,
        nickname: n,
      };

      DeviceConfigService.updateDevice(newConfig);
    },
    [deviceConfig]
  );

  const removePlugin = useCallback(
    (pluginId: string) => {
      DeviceConfigService.removePlugin(pluginId, deviceConnectionDetails!.id);
    },
    [deviceConnectionDetails]
  );

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showDevicePluginMenu(x, y, selectedDevice);
    },
    [selectedDevice]
  );

  return (
    <div className="details-panel device-details-panel">
      <div className={`${configured ? '' : 'deactivated'}`}>
        <SectionHeader title="DEVICE SETTINGS" size="large" />
        <div
          className={`subpanel nickname-subpanel ${
            configured ? '' : 'deactivated'
          }`}
        >
          <div className="nickname-display">
            <h1>{deviceName}</h1>
          </div>
          {isAdapter && (
            <>
              <AdapterDetailsSubpanel /> <AdapterSelect device={deviceConfig} />
            </>
          )}
          <label htmlFor="nickname-input">
            Nickname:
            <ControlledInput
              id="nickname-input"
              type="text"
              value={deviceNickname}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
        </div>
        <PluginSubpanel
          plugins={deviceConfig?.plugins || []}
          removePlugin={removePlugin}
          showPluginMenu={showPluginMenu}
          selectedDevice={selectedDevice}
          importPlugin={(title) => importDeviceSubcomponent(title, 'gui')}
          showAddPlugin
        />
      </div>
      <AddOrRemoveDevice
        nickname={deviceConfig?.nickname || ''}
        id={selectedDevice}
        configured={configured}
      />
    </div>
  );
}
