// import { useCallback } from 'react';
// import SettingsLineItem from '../../../SettingsLineItem';
// import { BaseInputGroup } from '../../input-group/base-input-group';

// const { ConfigService } = window;

// type PropTypes = {
//   group: BaseInputGroup;
//   deviceId: string;
// };

// export default function StatusStringDropdown(props: PropTypes) {
//   const { group, deviceId } = props;
//   const { eligibleStatusStrings, statusString } = group;
//   const statusStringLabels = eligibleStatusStrings.map((v) =>
//     group.labelForStatusString(v)
//   );

//   const onChange = useCallback(
//     (ss: StatusString | 'noteon/noteoff') => {
//       group.inputs.forEach((i) => {
//         i.statusString = ss;
//       });

//       ConfigService.updateInputs(deviceId, group.inputs);
//     },
//     [group, deviceId]
//   );

//   return (
//     <SettingsLineItem
//       label="Status:"
//       value={statusString}
//       valueList={eligibleStatusStrings}
//       labelList={statusStringLabels}
//       onChange={onChange}
//     />
//   );
// }

export default function StatusStringDropdown() {
  return null;
}
