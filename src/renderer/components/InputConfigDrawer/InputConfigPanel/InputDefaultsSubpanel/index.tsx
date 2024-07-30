import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';
import { MonoInputAggregate } from '../mono-input-aggregate';

type PropTypes = {
  inputs: MonoInputIcicle[];
};

export default function InputDefaultsSubpanel(props: PropTypes) {
  const { inputs } = props;

  const group = new MonoInputAggregate(inputs);

  return (
    <div className="subpanel input-defaults-subpanel">
      <h1>Default MIDI Settings</h1>
      <p>Output Response: {group.outputResponse}</p>
      <p>Event Type: {group.statusString}</p>
      <p>Channel: {group.channel}</p>
      <p>Number: {group.number}</p>
    </div>
  );
}
