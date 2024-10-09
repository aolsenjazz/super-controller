import type { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import ShareSustainLine from './ShareSustainLine';
import { ShareSustainDTO } from '../share-sustain-dto';

import './ShareSustain.css';
import AddADevice from './AddADevice';

export default function GUI(props: PluginUIProps<ShareSustainDTO>) {
  const { plugin, connectedDevices, selectedDevice, applyChanges } = props;

  const onChange = (checked: boolean, id: string) => {
    const newTargets = checked
      ? plugin.sustainTargets.concat(id)
      : plugin.sustainTargets.filter((p) => p !== id);

    applyChanges({
      ...plugin,
      sustainTargets: newTargets,
    });
  };

  const SustainTargets = connectedDevices
    .filter((d) => d !== selectedDevice.id)
    .map((d) => {
      return (
        <ShareSustainLine
          name={d}
          key={d}
          onChange={(checked) => onChange(checked, d)}
          value={plugin.sustainTargets.includes(d)}
        />
      );
    });

  return (
    <div className="share-sustain">
      {SustainTargets.length > 0 ? SustainTargets : <AddADevice />}
    </div>
  );
}
