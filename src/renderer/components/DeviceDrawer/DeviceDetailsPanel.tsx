import { useCallback } from 'react';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { importDeviceSubcomponent } from '@plugins/plugin-loader';

import PluginSubpanel from '../PluginSubpanel';
import SectionHeader from '../SectionHeader';
import AddOrRemoveDevice from './AddOrRemoveDevice';
import AdapterDetailsSubpanel from './AdapterDetailsSubpanel';
import AdapterSelect from './AdapterSelect';
import ControlledInput from '../ControlledInput';
import { UnifiedDevice } from '../../unified-device';

const { DeviceConfigService } = window;

type PropTypes = {
  selectedDevice: UnifiedDevice;
};

export default function DeviceDetailsPanel(props: PropTypes) {
  const { selectedDevice } = props;
  const { id, config, connectionDetails: connDetails } = selectedDevice;

  const configured = config !== undefined;
  const isAdapter = config?.type === 'adapter';

  const deviceName = connDetails?.name || config?.portName || '';
  const deviceNickname = config?.nickname || '';

  const plugins = isAdapter ? config.child?.plugins : config?.plugins;

  const onChange = useCallback(
    (n: string) => {
      const newConfig: DeviceConfigDTO = {
        ...config!,
        nickname: n,
      };

      DeviceConfigService.updateDevice(newConfig);
    },
    [config]
  );

  const removePlugin = useCallback(
    (pluginId: string) => {
      DeviceConfigService.removePlugin(pluginId, id);
    },
    [id]
  );

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      DeviceConfigService.showDevicePluginMenu(x, y, id);
    },
    [id]
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
              <AdapterDetailsSubpanel />
              {config.child === undefined && (
                <AdapterSelect deviceConfig={config} />
              )}
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
          plugins={plugins || []}
          removePlugin={removePlugin}
          showPluginMenu={showPluginMenu}
          importPlugin={(title) => importDeviceSubcomponent(title, 'gui')}
          showAddPlugin
        />
      </div>
      <AddOrRemoveDevice
        nickname={config?.nickname || ''}
        portName={(connDetails?.name || config?.portName)!}
        siblingIndex={connDetails?.siblingIndex || config?.siblingIndex || 0}
        id={id}
        configured={configured}
      />
    </div>
  );
}
