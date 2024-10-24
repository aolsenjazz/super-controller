import { MessageResolver } from '../../../../message-resolver/message-resolver';
import { byteToStatusString } from '../../../../util';
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
  let Element;

  if (TWO_BYTE.includes(status)) {
    Element = (
      <TwoByteStepConfig
        bindingMsg={bindingMsg}
        defaultMsg={defaultMsg}
        eligibleStatuses={eligibleStatuses}
        onChange={onChange}
      />
    );
  } else {
    Element = (
      <ThreeByteStepConfig
        bindingMsg={bindingMsg}
        defaultMsg={defaultMsg}
        eligibleStatuses={eligibleStatuses}
        onChange={onChange}
      />
    );
  }

  return <div className="step-config">{Element}</div>;
}