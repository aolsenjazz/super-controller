import { useEffect, useState } from 'react';

import { PluginUIProps } from '@plugins/plugin-ui-props';
import { DeviceStub } from '@shared/device-stub';

import { ShareSustainIcicle } from '..';
import ShareSustainLine from './ShareSustainLine';
import AddADevice from './AddADevice';

import './ShareSustain.css';

interface ShareSustainProps extends PluginUIProps {
  plugins: ShareSustainIcicle[];
}

export default function GUI(props: ShareSustainProps) {
  const { connectedDevices, plugins, selectedDevice } = props;

  const [DeviceList, setDeviceList] = useState<JSX.Element[]>([]);

  const onChange = (checked: boolean) => {};

  useEffect(() => {
    const devicesMap = new Map<string, DeviceStub>(
      connectedDevices
        .filter((d) => d.id !== selectedDevice.id)
        .map((d) => [d.id, d])
    );

    const settingsLines = Array.from(devicesMap.values()).map((d) => {
      return (
        <ShareSustainLine
          name={d.name}
          onChange={onChange}
          value={plugins[0].sustainTargets.includes(d.id)}
        />
      );
    });

    setDeviceList(settingsLines);
  }, [connectedDevices, plugins, selectedDevice]);

  return (
    <div className="share-sustain">
      {DeviceList.length > 0 ? DeviceList : <AddADevice />}
    </div>
  );
}
