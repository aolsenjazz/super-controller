import { useEffect, useState } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useConnectedDevices } from '@hooks/use-connected-devices';
import { useDeviceConfig } from '@hooks/use-device-config';

import './PluginBody.css';

type PropTypes = {
  pluginId: string;
  title: string;
  selectedDevice: string;
  importPlugin: (title: string) => Promise<React.FC<PluginUIProps>>;
};

export default function PluginBody(props: PropTypes) {
  const { pluginId, title, selectedDevice, importPlugin } = props;

  const { deviceConfig } = useDeviceConfig(selectedDevice);
  const { connectedDeviceIds } = useConnectedDevices();

  const [UI, setUI] = useState<React.FC<PluginUIProps>>();

  useEffect(() => {
    importPlugin(title)
      .then((Element) => {
        setUI(() => Element);
        return null;
      })
      .catch((e) => {
        throw e;
      });
  }, [title, importPlugin]);

  if (deviceConfig === undefined) {
    throw new Error(
      'deviceConfig must not be undefined when rendering PluginUI'
    );
  }

  return (
    <div className="plugin-body">
      {UI && (
        <UI
          pluginId={pluginId}
          selectedDevice={deviceConfig}
          connectedDevices={connectedDeviceIds}
        />
      )}
    </div>
  );
}
