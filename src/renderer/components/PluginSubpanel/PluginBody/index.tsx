import { useEffect, useState } from 'react';

import { importDeviceSubcomponent } from '@plugins/plugin-loader';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useConnectedDevices } from '@hooks/use-connected-devices';
import { useDeviceConfig } from '@hooks/use-device-config';

import './PluginBody.css';

type PropTypes = {
  pluginId: string;
  title: string;
  selectedDevice: string;
};

export default function PluginBody(props: PropTypes) {
  const { pluginId, title, selectedDevice } = props;

  const { deviceConfig } = useDeviceConfig(selectedDevice);
  const { connectedDeviceIds } = useConnectedDevices();

  const [UI, setUI] = useState<React.FC<PluginUIProps>>();

  useEffect(() => {
    importDeviceSubcomponent(title, 'gui')
      .then((Element) => {
        setUI(() => Element);
        return null;
      })
      .catch((e) => {
        throw e;
      });
  }, [title]);

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
