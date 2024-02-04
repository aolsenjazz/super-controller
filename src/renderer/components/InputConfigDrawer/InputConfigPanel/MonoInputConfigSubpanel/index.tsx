import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';
import PluginSubpanel from 'renderer/components/PluginSubpanel';
import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputIcicle[];
  deviceId: string;
};

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  return (
    <div>
      <InputDefaultsSubpanel inputs={inputs} />
      <PluginSubpanel
        deviceId={deviceId}
        plugins={[]}
        removePlugin={() => {}}
        showPluginMenu={() => {}}
      />
    </div>
  );
}
