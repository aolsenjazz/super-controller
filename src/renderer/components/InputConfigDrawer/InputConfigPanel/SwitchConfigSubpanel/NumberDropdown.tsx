import { CC_BINDINGS, NOTE_BINDINGS } from '@shared/util';
import SettingsLineItem from '../../SettingsLineItem';

type PropTypes = {
  onChange: (arr: NumberArrayWithStatus) => void;
  override: NumberArrayWithStatus;
  defaultMsg: NumberArrayWithStatus;
  statusString: StatusString;
};

export default function NumberDropdown(props: PropTypes) {
  const { onChange, override, defaultMsg, statusString } = props;

  const eligibleNumbers = [...Array(128).keys()] as MidiNumber[];

  const numberLabels = eligibleNumbers.map((v) => {
    const isDefault = defaultMsg[1] === v;

    if (['noteon', 'noteoff'].includes(statusString)) {
      return `${v} ${isDefault ? '[default]' : NOTE_BINDINGS.get(v)}`;
    }

    return statusString === 'controlchange'
      ? `${v} ${isDefault ? '' : CC_BINDINGS.get(v)} ${
          isDefault ? '[default]' : ''
        }`
      : `${v} ${isDefault ? '[default]' : ''}`;
  });

  return (
    <SettingsLineItem<MidiNumber>
      label="Number:"
      value={override[1]}
      valueList={eligibleNumbers}
      labelList={numberLabels}
      onChange={(v) => {
        const newArr = JSON.parse(JSON.stringify(override));
        newArr[1] = v;
        onChange(newArr);
      }}
    />
  );
}
