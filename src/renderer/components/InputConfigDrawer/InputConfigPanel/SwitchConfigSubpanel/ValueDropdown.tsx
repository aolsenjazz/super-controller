import SettingsLineItem from '../../SettingsLineItem';

type PropTypes = {
  onChange: (arr: NumberArrayWithStatus) => void;
  override: NumberArrayWithStatus;
  defaultMsg: NumberArrayWithStatus;
};

export default function ValueDropdown(props: PropTypes) {
  const { onChange, override, defaultMsg } = props;

  const value = override.length === 3 ? override[2] : 0;
  const eligibleValues = [...Array(128).keys()] as MidiNumber[];
  const valueLabels = eligibleValues.map((v) => {
    return override.length === 2
      ? `${v} ${v === defaultMsg[2] ? '[default]' : ''}`
      : `${v}`;
  });

  return (
    <SettingsLineItem<MidiNumber>
      label="Value:"
      value={value}
      valueList={eligibleValues}
      labelList={valueLabels}
      onChange={(v) => {
        const newArr = JSON.parse(JSON.stringify(override));
        newArr[2] = v;
        onChange(newArr);
      }}
    />
  );
}
