import { useSelector } from 'react-redux';

import type { PluginDTO } from '@plugins/core/base-plugin';
import { selectUnifiedDevices } from '@selectors/unified-devices-selector';
import { selectSelectedDevice } from '@selectors/selected-device-selector';

import { selectPluginById } from '@features/plugins/plugins-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';

import './PluginBody.css';
import { getPluginUI } from 'renderer/plugin-files';

const { PluginService } = window;

type PropTypes = {
  pluginId: string;
  title: string;
};

export default function PluginBody(props: PropTypes) {
  const { pluginId, title } = props;

  const selectedDevice = useSelector(selectSelectedDevice)!;
  const connectedDevices = useSelector(selectUnifiedDevices);
  const plugin = useAppSelector((state) => selectPluginById(state, pluginId));

  const connectedDeviceIds = connectedDevices
    .filter((c) => c.connectionDetails)
    .map((c) => c.id);
  const configuredDeviceIds = connectedDevices
    .filter((c) => c.config)
    .map((c) => c.id);

  const UI = getPluginUI(title);

  const updatePlugin = (dto: PluginDTO) => {
    PluginService.updatePlugin(dto);
  };

  if (selectedDevice.config === undefined) {
    throw new Error(
      'deviceConfig must not be undefined when rendering PluginUI',
    );
  }

  return (
    <div className="plugin-body">
      {UI && (
        <UI
          plugin={plugin}
          selectedDevice={selectedDevice.config}
          connectedDevices={connectedDeviceIds}
          configuredDevices={configuredDeviceIds}
          applyChanges={updatePlugin}
        />
      )}
    </div>
  );
}
