import { BinaryMessageResolverDTO } from '../../message-resolver/binary-message-resolver';
import { StatusSelect } from '../StatusSelect';
import { ChannelSelect } from '../ChannelSelect';
import { NumberSelect } from '../NumberSelect';

type PropTypes = {
  resolver: BinaryMessageResolverDTO;
  onChange: (updatedResolver: BinaryMessageResolverDTO) => void;
};

export default function BinaryMessageResolverConfig(props: PropTypes) {
  const { resolver, onChange } = props;
  const {
    eligibleStatuses,
    channelOverride,
    numberOverride,
    statusOverride,
    defaultStatus,
    defaultChannel,
    defaultNumber,
  } = resolver;

  const handleStatusChange = (status: StatusString | 'noteon/noteoff') => {
    const newResolver = { ...resolver, statusOverride: status };
    onChange(newResolver);
  };

  const handleChannelChange = (channel: Channel) => {
    const newResolver = { ...resolver, channelOverride: channel };
    onChange(newResolver);
  };

  const handleNumberChange = (number: MidiNumber) => {
    const newResolver = { ...resolver, numberOverride: number };
    onChange(newResolver);
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
