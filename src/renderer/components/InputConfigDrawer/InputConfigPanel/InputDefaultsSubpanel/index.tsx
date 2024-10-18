import { InputDefault } from '@shared/hardware-config/input-config/mono-input-config';

type PropTypes = {
  defaults: InputDefault;
};

export default function InputDefaultsSubpanel(props: PropTypes) {
  const { defaults } = props;

  return (
    <div className="subpanel input-defaults-subpanel">
      <h1>Default MIDI Settings</h1>
      <p>Output Response: {defaults.response}</p>
      <p>Event Type: {defaults.statusString}</p>
      <p>Channel: {defaults.channel}</p>
      <p>Number: {defaults.number}</p>
      {defaults.value !== undefined && <p>Value: {defaults.value}</p>}
    </div>
  );
}
