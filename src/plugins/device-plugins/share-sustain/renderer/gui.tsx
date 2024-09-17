import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import type { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import ShareSustainLine from './ShareSustainLine';
import AddADevice from './AddADevice';
import { ShareSustainDTO } from '../share-sustain-dto';

import './ShareSustain.css';

const { ShareSustainService, PluginService } = window;

export default function GUI(props: PluginUIProps) {
  const { pluginId, connectedDevices, selectedDevice } = props;

  const [sharingWith, setSharingWith] = useState<string[]>([]);
  const [SustainTargets, setSustainTargets] = useState<JSX.Element[]>([]);

  // set intialize state from plugin config
  useLayoutEffect(() => {
    const plugin = PluginService.getPlugin<ShareSustainDTO>(pluginId);
    setSharingWith(plugin!.sustainTargets);
  }, [pluginId]);

  // listen for updates to the plugin
  useEffect(() => {
    const cancel = PluginService.addPluginListener<ShareSustainDTO>(
      pluginId,
      (dto) => {
        setSharingWith(dto.sustainTargets);
      }
    );

    return () => cancel();
  }, [pluginId]);

  const onChange = useCallback(
    (checked: boolean, id: string) => {
      const shareWith = checked
        ? sharingWith.concat(id)
        : sharingWith.filter((p) => p !== id);

      ShareSustainService.update(pluginId, shareWith);
    },
    [pluginId, sharingWith]
  );

  // when connected devices change, update the list of sustain targets
  useEffect(() => {
    const devicesList = connectedDevices.filter((d) => d !== selectedDevice.id);

    const settingsLines = devicesList.map((d) => {
      return (
        <ShareSustainLine
          name={d}
          key={d}
          onChange={(checked) => onChange(checked, d)}
          value={sharingWith.includes(d)}
        />
      );
    });

    setSustainTargets(settingsLines);
  }, [connectedDevices, sharingWith, selectedDevice, onChange]);

  return (
    <div className="share-sustain">
      {SustainTargets.length > 0 ? SustainTargets : <AddADevice />}
    </div>
  );
}
