import { useEffect, useState } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import './PluginBody.css';
import { useSelector } from 'react-redux';
import { selectUnifiedDevices } from '@selectors/unified-devices-selector';
import { selectSelectedDevice } from '@selectors/selected-device-selector';

type PropTypes = {
  pluginId: string;
  title: string;
  selectedDevice: string;
  importPlugin: (title: string) => Promise<React.FC<PluginUIProps>>;
};

export default function PluginBody(props: PropTypes) {
  const { pluginId, title, importPlugin } = props;

  const selectedDevice = useSelector(selectSelectedDevice)!;
  const connectedDevices = useSelector(selectUnifiedDevices);
  const connectedDeviceIds = connectedDevices
    .filter((c) => c.connectionDetails)
    .map((c) => c.id);

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

  if (selectedDevice.config === undefined) {
    throw new Error(
      'deviceConfig must not be undefined when rendering PluginUI'
    );
  }

  return (
    <div className="plugin-body">
      {UI && (
        <UI
          pluginId={pluginId}
          selectedDevice={selectedDevice.config}
          connectedDevices={connectedDeviceIds}
        />
      )}
    </div>
  );
}
