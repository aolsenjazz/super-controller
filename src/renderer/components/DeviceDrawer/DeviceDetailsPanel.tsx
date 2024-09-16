import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import type { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { useSelectedDeviceConfig } from '@context/selected-device-config-context';
import { useDeviceStub } from '@hooks/use-device-stub';

import NicknameSubpanel from '../NicknameSubpanel';
import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';

const { DeviceConfigService, MenuService } = window;

export default function DeviceDetailsPanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceStub } = useDeviceStub(selectedDevice || '');
  const { deviceConfig } = useSelectedDeviceConfig();

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
      DeviceConfigService.removePlugin(pluginId, deviceStub!.id);
    },
    [deviceStub]
  );

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showDevicePluginMenu(x, y, deviceConfig!.id);
    },
    [deviceConfig]
  );

  return (
    <div className="details-panel device-details-panel">
      <div className={`${deviceConfig ? '' : 'deactivated'}`}>
        <SectionHeader title="DEVICE SETTINGS" size="large" />
        <NicknameSubpanel
          name={deviceStub?.name || deviceConfig?.portName || ''}
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
        id={deviceConfig?.id || ''}
        configured={deviceConfig !== undefined}
      />
    </div>
  );
}
