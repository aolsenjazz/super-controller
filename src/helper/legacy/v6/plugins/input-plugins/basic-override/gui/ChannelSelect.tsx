type ChannelSelectProps = {
  defaultChannel: Channel;
  channelOverride: Channel;
  onChannelChange: (channel: Channel) => void;
};

export function ChannelSelect(props: ChannelSelectProps) {
  const { defaultChannel, channelOverride, onChannelChange } = props;

  const channels = Array.from(Array(16).keys());
  const channelLabels = channels.map(
    (c) => `Channel ${c}${c === defaultChannel ? ' [default]' : ''}`
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const channel = Number(e.target.value) as Channel;
    onChannelChange(channel);
  };

  return (
    <label>
      Channel:
      <select value={channelOverride} onChange={handleChange}>
        {channels.map((n, i) => (
          <option key={n} value={n}>
            {channelLabels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
