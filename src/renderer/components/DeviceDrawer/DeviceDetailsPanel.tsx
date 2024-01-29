import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import type { PluginIcicle } from '@plugins/base-plugin';
import { useSelectedDeviceConfig } from '@context/selected-device-config-context';
import { useDeviceStub } from '@hooks/use-device-stub';

import NicknameSubpanel from '../NicknameSubpanel';
import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';

const { ConfigService, MenuService } = window;

export default function DeviceDetailsPanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceStub } = useDeviceStub(selectedDevice || '');
  const { deviceConfig } = useSelectedDeviceConfig();

  const onChange = useCallback((n: string) => {
    return n;
  }, []);

  const removePlugin = useCallback(
    (icicle: PluginIcicle) => {
      deviceConfig!.plugins = deviceConfig!.plugins.filter(
        (p) => p.id !== icicle.id
      );
      ConfigService.updateDevice(deviceConfig!);
    },
    [deviceConfig]
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
        />
        <PluginSubpanel
          plugins={deviceConfig?.plugins || []}
          removePlugin={removePlugin}
          deviceId={deviceConfig?.id || ''}
          showPluginMenu={showPluginMenu}
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
