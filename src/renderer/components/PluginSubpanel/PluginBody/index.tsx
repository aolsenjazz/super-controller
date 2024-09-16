import { importDeviceSubcomponent } from '@plugins/plugin-loader';
import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { useEffect, useState } from 'react';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useSelectedDeviceConfig } from '@context/selected-device-config-context';
import { useConnectedDevices } from '@hooks/use-connected-devices';

import './PluginBody.css';

type PropTypes = {
  plugins: PluginDTO[];
};

export default function PluginBody(props: PropTypes) {
  const { plugins } = props;

  const { deviceConfig } = useSelectedDeviceConfig();
  const { connectedDevices } = useConnectedDevices();

  const [UI, setUI] = useState<React.FC<PluginUIProps>>();

  useEffect(() => {
    importDeviceSubcomponent(plugins[0].title, 'gui')
      .then((Element) => {
        setUI(() => Element);
        return null;
      })
      .catch((e) => {
        throw e;
      });
  }, [plugins]);

  return (
    <div className="plugin-body">
      {UI && (
        <UI
          plugins={plugins}
          selectedDevice={deviceConfig!}
          connectedDevices={connectedDevices!}
        />
      )}
    </div>
  );
}
