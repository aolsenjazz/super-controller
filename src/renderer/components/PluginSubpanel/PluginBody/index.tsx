import { importDeviceSubcomponent } from '@plugins/index';
import { PluginIcicle } from '@plugins/base-plugin';
import { useEffect, useState } from 'react';
import { PluginUIProps } from '@plugins/plugin-ui-props';
import { useSelectedDeviceConfig } from '@context/selected-device-config-context';
import { useConnectedDevices } from '@hooks/use-connected-devices';

import './PluginBody.css';

type PropTypes = {
  plugins: PluginIcicle[];
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
