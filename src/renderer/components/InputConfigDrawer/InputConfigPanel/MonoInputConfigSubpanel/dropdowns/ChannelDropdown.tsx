// import { useCallback } from 'react';

// import SettingsLineItem from '../../../SettingsLineItem';
// import { BaseInputGroup } from '../../input-group/base-input-group';

// const { ConfigService } = window;

// type PropTypes = {
//   group: BaseInputGroup;
//   deviceId: string;
// };

// export default function ChannelDropdown(props: PropTypes) {
//   const { group, deviceId } = props;
//   const { channel } = group;

//   const eligibleChannels = [...Array(16).keys()] as Channel[];
//   const channelLabels = eligibleChannels.map((v) => group.labelForChannel(v));

//   const onChange = useCallback(
//     (c: Channel) => {
//       group.inputs.forEach((i) => {
//         i.channel = c;
//         ConfigService.updateInputs(deviceId, group.inputs);
//       });
//     },
//     [group, deviceId]
//   );

//   return (
//     <SettingsLineItem
//       label="Channel:"
//       value={channel}
//       labelList={channelLabels}
//       valueList={eligibleChannels}
//       onChange={onChange}
//     />
//   );
// }

export default function ChannelDropdown() {
  return null;
}
