import { PitchbendMessageResolverDTO } from '../../message-resolver/pitchbend-message-resolver';
import { ChannelSelect } from '../ChannelSelect';
import { StatusSelect } from '../StatusSelect';

type PropTypes = {
  resolver: PitchbendMessageResolverDTO;
  onChange: (resolver: PitchbendMessageResolverDTO) => void;
};

export default function PitchbendMessageResolverConfig(props: PropTypes) {
  const { resolver, onChange } = props;
  const {
    eligibleStatuses,
    statusOverride,
    channelOverride,
    defaultStatus,
    defaultChannel,
  } = resolver;

  const handleStatusChange = (status: string) => {
    const newResolver = {
      ...resolver,
      statusOverride: status as 'pitchbend' | 'controlchange',
    };
    onChange(newResolver);
  };

  const handleChannelChange = (channel: Channel) => {
    const newResolver = { ...resolver, channelOverride: channel };
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
    </>
  );
}
