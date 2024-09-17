import { importDeviceSubcomponent } from '@plugins/plugin-loader';
import { useEffect, useState } from 'react';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useConnectedDevices } from '@hooks/use-connected-devices';

import './PluginBody.css';
import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceConfig } from '@hooks/use-device-config';

type PropTypes = {
  pluginId: string;
  title: string;
};

export default function PluginBody(props: PropTypes) {
  const { pluginId, title } = props;

  const { selectedDevice } = useSelectedDevice();
  const { deviceConfig } = useDeviceConfig(selectedDevice || '');
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

  return (
    <div className="plugin-body">
      {UI && (
        <UI
          pluginId={pluginId}
          selectedDevice={deviceConfig!}
          connectedDevices={connectedDeviceIds}
        />
      )}
    </div>
  );
}
