// import { useCallback } from 'react';

// import SettingsLineItem from '../../../SettingsLineItem';
// import { BaseInputGroup } from '../../input-group/base-input-group';

// const { ConfigService } = window;

// type PropTypes = {
//   group: BaseInputGroup;
//   deviceId: string;
// };

// export default function ValueDropdown(props: PropTypes) {
//   const { group, deviceId } = props;

//   const eligibleValues = [...Array(128).keys()] as MidiNumber[];

//   const onChange = useCallback(
//     (n: MidiNumber) => {
//       group.inputs.forEach((i) => {
//         i.value = n;
//         ConfigService.updateInputs(deviceId, group.inputs);
//       });
//     },
//     [group, deviceId]
//   );

//   return (
//     <SettingsLineItem
//       label="Value:"
//       value={group.value}
//       valueList={eligibleValues}
//       labelList={eligibleValues.map((v) => v.toString())}
//       onChange={onChange}
//     />
//   );
// }

export default function ValueDropdown() {
  return null;
}
