import { useSelectedDevice } from '@context/selected-device-context';
import { useConfigStub } from '@hooks/use-config-stub';
import { useDeviceStub } from '@hooks/use-device-stub';
import { useCallback } from 'react';
import NicknameSubpanel from '../NicknameSubpanel';
import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';

export default function DeviceDetailsPanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceStub } = useDeviceStub(selectedDevice || '');
  const { configStub } = useConfigStub(selectedDevice || '');

  const onChange = useCallback((n) => {
    return n;
  }, []);

  return (
    <div className="device-details-panel">
      <div className={`${configStub ? '' : 'deactivated'}`}>
        <SectionHeader title="DEVICE SETTINGS" size="large" />
        <NicknameSubpanel
          name={deviceStub?.name || configStub?.portName || ''}
          nickname={configStub?.nickname || ''}
          onNicknameChange={onChange}
        />
        <PluginSubpanel plugins={configStub?.plugins || []} />
      </div>
      <AddOrRemoveDevice
        nickname={configStub?.nickname || ''}
        id={configStub?.id || ''}
        configured={configStub !== undefined}
      />
    </div>
  );
}
