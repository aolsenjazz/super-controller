import SettingsLineItem from '../../SettingsLineItem';

type PropTypes = {
  onChange: (arr: NumberArrayWithStatus) => void;
  override: NumberArrayWithStatus;
  defaultMsg: NumberArrayWithStatus;
};

export default function ChannelDropdown(props: PropTypes) {
  const { onChange, override, defaultMsg } = props;

  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const channelLabels = eligibleChannels.map((c) => {
    return `${c} ${c === (defaultMsg[0] & 0x0f) ? '[default]' : ''}`;
  });

  return (
    <SettingsLineItem
      label="Channel:"
      value={override[0] & 0x0f}
      labelList={channelLabels}
      valueList={eligibleChannels}
      onChange={(c) => {
        const newArr: NumberArrayWithStatus = JSON.parse(
          JSON.stringify(override)
        );
        newArr[0] = (c | (newArr[0] & 0xf0)) as StatusNumber;
        onChange(newArr);
      }}
    />
  );
}
