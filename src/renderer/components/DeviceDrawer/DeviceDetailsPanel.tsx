import { useCallback, useMemo } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useDeviceConfig } from '@hooks/use-device-config';

import NicknameSubpanel from '../NicknameSubpanel';
import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';

const { DeviceConfigService, MenuService, HostService } = window;

export default function DeviceDetailsPanel() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceConfig } = useDeviceConfig(selectedDevice || '');
  const configured = deviceConfig !== undefined;

  const deviceConnectionDetails = useMemo(
    () => HostService.getDeviceConnectionDetails(selectedDevice || ''),
    [selectedDevice]
  );

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
      MenuService.showDevicePluginMenu(x, y, selectedDevice || '');
    },
    [selectedDevice]
  );

  return (
    <div className="details-panel device-details-panel">
      <div className={`${configured ? '' : 'deactivated'}`}>
        <SectionHeader title="DEVICE SETTINGS" size="large" />
        <NicknameSubpanel
          name={deviceConnectionDetails?.name || deviceConfig?.portName || ''}
          nickname={deviceConfig?.nickname || ''}
          onNicknameChange={onChange}
          deactivated={false}
        />
        <PluginSubpanel
          plugins={deviceConfig?.plugins || []}
          removePlugin={removePlugin}
          showPluginMenu={showPluginMenu}
          showAddPlugin
        />
      </div>
      <AddOrRemoveDevice
        nickname={deviceConfig?.nickname || ''}
        id={selectedDevice || ''}
        configured={configured}
      />
    </div>
  );
}
