import { byteToStatusString } from '../../../../util';

import { initMessage } from '../../../../message-resolver/discrete-message-resolver';
import { MessageResolver } from '../../../../message-resolver/message-resolver';
import { ChannelSelect } from '../../../ChannelSelect';
import { NumberSelect } from '../../../NumberSelect';
import { StatusSelect } from '../../../StatusSelect';
import { ValueSelect } from '../../../ValueSelect';

type PropTypes = {
  defaultMsg: NumberArrayWithStatus;
  bindingMsg: NumberArrayWithStatus;
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  onChange: (binding: NumberArrayWithStatus) => void;
};

export default function ThreeByteStepConfig(props: PropTypes) {
  const { defaultMsg, bindingMsg, eligibleStatuses, onChange } = props;

  const defaultStatus = byteToStatusString(
    (defaultMsg[0] & 0xf0) as StatusByte,
    true,
  );
  const defaultChannel = (defaultMsg[0] & 0x0f) as Channel;
  const defaultNumber = defaultMsg[1] as MidiNumber;
  const defaultValue = defaultMsg[2] as MidiNumber;

  const statusOverride = byteToStatusString(
    (bindingMsg[0] & 0xf0) as StatusByte,
    true,
  );
  const channelOverride = (bindingMsg[0] & 0x0f) as Channel;
  const numberOverride = bindingMsg[1] as MidiNumber;
  const valueOverride = bindingMsg[2] as MidiNumber;

  const handleStatusChange = (status: StatusString | 'noteon/noteoff') => {
    const newBinding = initMessage(
      status,
      channelOverride,
      numberOverride,
      valueOverride,
    );
    onChange(newBinding);
  };

  const handleChannelChange = (channel: Channel) => {
    const newBinding = initMessage(
      statusOverride,
      channel,
      numberOverride,
      valueOverride,
    );
    onChange(newBinding);
  };

  const handleNumberChange = (number: MidiNumber) => {
    const newBinding = initMessage(
      statusOverride,
      channelOverride,
      number,
      valueOverride,
    );
    onChange(newBinding);
  };

  const handleValueChange = (value: MidiNumber) => {
    const newBinding = initMessage(
      statusOverride,
      channelOverride,
      numberOverride,
      value,
    );
    onChange(newBinding);
  };

  return (
    <>
      <StatusSelect
        eligibleStatuses={eligibleStatuses}
        defaultStatus={defaultStatus}
        statusOverride={statusOverride}
        onStatusChange={handleStatusChange}
      />
      <ChannelSelect
        defaultChannel={defaultChannel}
        channelOverride={channelOverride}
        onChannelChange={handleChannelChange}
      />
      <NumberSelect
        defaultNumber={defaultNumber}
        numberOverride={numberOverride}
        statusOverride={statusOverride}
        onNumberChange={handleNumberChange}
      />
      <ValueSelect
        onValueChange={handleValueChange}
        valueOverride={valueOverride}
        defaultValue={defaultValue}
      />
    </>
  );
}
