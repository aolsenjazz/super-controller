import { MessageResolver } from '@plugins/input-plugins/basic-override/message-resolver/message-resolver';
import { byteToStatusString } from '@shared/midi-util';
import ThreeByteStepConfig from './ThreeByteStepConfig';
import TwoByteStepConfig from './TwoByteStepConfig';

const TWO_BYTE = ['programchange'];

type PropTypes = {
  defaultMsg: NumberArrayWithStatus;
  bindingMsg: NumberArrayWithStatus;
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  onChange: (binding: NumberArrayWithStatus) => void;
};

export default function StepConfig(props: PropTypes) {
  const { defaultMsg, bindingMsg, eligibleStatuses, onChange } = props;

  const status = byteToStatusString((bindingMsg[0] & 0xf0) as StatusByte, true);

  // TODO: sysex

  if (TWO_BYTE.includes(status)) {
    return (
      <TwoByteStepConfig
        bindingMsg={bindingMsg}
        defaultMsg={defaultMsg}
        eligibleStatuses={eligibleStatuses}
        onChange={onChange}
      />
    );
  }

  return (
    <ThreeByteStepConfig
      bindingMsg={bindingMsg}
      defaultMsg={defaultMsg}
      eligibleStatuses={eligibleStatuses}
      onChange={onChange}
    />
  );
}
