import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

type PropTypes = {
  input: InputDTO;
};

export default function InputDefaultsSubpanel(props: PropTypes) {
  const { input } = props;

  return (
    <div className="subpanel input-defaults-subpanel">
      <h1>Default MIDI Settings</h1>
      <p>Output Response: {input.defaults.response}</p>
      <p>Event Type: {input.defaults.statusString}</p>
      <p>Channel: {input.defaults.channel}</p>
      <p>Number: {input.defaults.number}</p>
    </div>
  );
}
