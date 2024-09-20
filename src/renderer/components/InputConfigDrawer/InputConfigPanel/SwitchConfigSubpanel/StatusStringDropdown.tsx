import { byteToStatusString, statusStringToNibble } from '@shared/midi-util';
import SettingsLineItem from '../../SettingsLineItem';

type PropTypes = {
  onChange: (arr: NumberArrayWithStatus) => void;
  override: NumberArrayWithStatus;
  defaultMsg: NumberArrayWithStatus;
  statusString: StatusString;
};

export default function StatusStringDropdown(props: PropTypes) {
  const { onChange, override, defaultMsg, statusString } = props;

  const eligibleStatusStrings: StatusString[] = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];

  const statusLabels = eligibleStatusStrings.map((s) => {
    const defStatus = byteToStatusString((defaultMsg[0] & 0xf0) as StatusByte);
    return `${s} ${s === defStatus ? '[default]' : ''}`;
  });

  return (
    <SettingsLineItem<StatusString>
      label="Event Type:"
      value={statusString}
      valueList={eligibleStatusStrings}
      labelList={statusLabels}
      onChange={(v) => {
        const newByte = statusStringToNibble(v);
        const newArr = JSON.parse(JSON.stringify(override));
        newArr[0] = newByte | (newArr[0] & 0x0f);
        onChange(newArr);
      }}
    />
  );
}
