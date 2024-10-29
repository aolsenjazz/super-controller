import { ContinuousMessageResolverDTO } from '../../message-resolver/continuous-message-resolver';
import { StatusSelect } from '../StatusSelect';
import { ChannelSelect } from '../ChannelSelect';
import { NumberSelect } from '../NumberSelect';

type PropTypes = {
  resolver: ContinuousMessageResolverDTO;
  onChange: (updatedResolver: ContinuousMessageResolverDTO) => void;
};

export default function ContinuousMessageResolverConfig(props: PropTypes) {
  const { resolver, onChange } = props;
  const {
    eligibleStatuses,
    statusOverride,
    channelOverride,
    numberOverride,
    defaultStatus,
    defaultChannel,
    defaultNumber,
  } = resolver;

  const handleStatusChange = (status: StatusString | 'noteon/noteoff') => {
    const newResolver = { ...resolver, statusOverride: status as StatusString };
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
      {statusOverride !== 'pitchbend' && (
        <NumberSelect
          defaultNumber={defaultNumber}
          numberOverride={numberOverride}
          statusOverride={statusOverride}
          onNumberChange={handleNumberChange}
        />
      )}
    </>
  );
}
