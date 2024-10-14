// import { useCallback } from 'react';

// import { byteToStatusString } from '@shared/midi-util';
// import { SwitchDTO } from '@shared/hardware-config/input-config/switch-config';

// import ChannelDropdown from './ChannelDropdown';
// import StatusStringDropdown from './StatusStringDropdown';
// import NumberDropdown from './NumberDropdown';
// import ValueDropdown from './ValueDropdown';

// const { InputConfigService } = window;

// type PropTypes = {
//   defaultMsg: NumberArrayWithStatus;
//   override: NumberArrayWithStatus;
//   config: SwitchDTO;
//   deviceId: string;
// };

export default function MonoInputConfigPanel() {
  // const { defaultMsg, override, config, deviceId } = props;

  // const statusString = byteToStatusString(
  //   (override[0] & 0xf0) as StatusByte,
  //   true
  // ) as StatusString;

  // const onChange = useCallback(
  //   (m: NumberArrayWithStatus) => {
  //     config.steps[JSON.stringify(defaultMsg)] = m;
  //     InputConfigService.updateInputs([config]);
  //   },
  //   [defaultMsg, config, deviceId]
  // );

  // return (
  //   <div>
  //     <div id="controls-container">
  //       <StatusStringDropdown
  //         override={override}
  //         onChange={onChange}
  //         defaultMsg={defaultMsg}
  //         statusString={statusString}
  //       />
  //       <ChannelDropdown
  //         override={override}
  //         onChange={onChange}
  //         defaultMsg={defaultMsg}
  //       />
  //       <NumberDropdown
  //         override={override}
  //         onChange={onChange}
  //         defaultMsg={defaultMsg}
  //         statusString={statusString}
  //       />
  //       {statusString !== 'programchange' && (
  //         <ValueDropdown
  //           override={override}
  //           onChange={onChange}
  //           defaultMsg={defaultMsg}
  //         />
  //       )}
  //       <button type="button" onClick={() => onChange(defaultMsg)}>
  //         Restore Defaults
  //       </button>
  //     </div>
  //   </div>
  // );
  return null;
}
