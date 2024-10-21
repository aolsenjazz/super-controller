import { byteToStatusString, statusStringToNibble } from '@shared/midi-util';
import { MessageResolver } from '../../../../message-resolver/message-resolver';
import { ChannelSelect } from '../../../ChannelSelect';
import { NumberSelect } from '../../../NumberSelect';
import { StatusSelect } from '../../../StatusSelect';

type PropTypes = {
  defaultMsg: NumberArrayWithStatus;
  bindingMsg: NumberArrayWithStatus;
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  onChange: (binding: NumberArrayWithStatus) => void;
};

export default function TwoByteStepConfig(props: PropTypes) {
  const { defaultMsg, bindingMsg, eligibleStatuses, onChange } = props;

  const defaultStatus = byteToStatusString(
    (defaultMsg[0] & 0xf0) as StatusByte,
    true
  );
  const defaultChannel = (defaultMsg[0] & 0x0f) as Channel;
  const defaultNumber = defaultMsg[1] as MidiNumber;

  const statusOverride = byteToStatusString(
    (bindingMsg[0] & 0xf0) as StatusByte,
    true
  );
  const channelOverride = (bindingMsg[0] & 0x0f) as Channel;
  const numberOverride = bindingMsg[1] as MidiNumber;

  const handleStatusChange = (status: StatusString | 'noteon/noteoff') => {
    const newBinding = [
      statusStringToNibble(status as StatusString) + channelOverride,
      numberOverride,
    ] as NumberArrayWithStatus;
    onChange(newBinding);
  };

  const handleChannelChange = (channel: Channel) => {
    const newBinding = [
      statusStringToNibble(statusOverride as StatusString) + channel,
      numberOverride,
    ] as NumberArrayWithStatus;
    onChange(newBinding);
  };

  const handleNumberChange = (number: MidiNumber) => {
    const newBinding = [
      statusStringToNibble(statusOverride as StatusString) + channelOverride,
      number,
    ] as NumberArrayWithStatus;
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
    </>
  );
}
