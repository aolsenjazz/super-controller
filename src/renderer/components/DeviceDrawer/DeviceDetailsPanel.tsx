import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { useConfigStub } from '@hooks/use-config-stub';
import { useDeviceStub } from '@hooks/use-device-stub';
import type { PluginIcicle } from '@plugins/base-plugin';

import NicknameSubpanel from '../NicknameSubpanel';
import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';

const { ConfigService, MenuService } = window;

export default function DeviceDetailsPanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceStub } = useDeviceStub(selectedDevice || '');
  const { configStub } = useConfigStub(selectedDevice || '');

  const onChange = useCallback((n: string) => {
    return n;
  }, []);

  const removePlugin = useCallback(
    (icicle: PluginIcicle) => {
      configStub!.plugins = configStub!.plugins.filter(
        (p) => p.id !== icicle.id
      );
      ConfigService.updateDevice(configStub!);
    },
    [configStub]
  );

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showDevicePluginMenu(x, y, configStub!.id);
    },
    [configStub]
  );

  return (
    <div className="device-details-panel">
      <div className={`${configStub ? '' : 'deactivated'}`}>
        <SectionHeader title="DEVICE SETTINGS" size="large" />
        <NicknameSubpanel
          name={deviceStub?.name || configStub?.portName || ''}
          nickname={configStub?.nickname || ''}
          onNicknameChange={onChange}
        />
        <PluginSubpanel
          plugins={configStub?.plugins || []}
          removePlugin={removePlugin}
          deviceId={configStub?.id || ''}
          showPluginMenu={showPluginMenu}
        />
      </div>
      <AddOrRemoveDevice
        nickname={configStub?.nickname || ''}
        id={configStub?.id || ''}
        configured={configStub !== undefined}
      />
    </div>
  );
}
