import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

import InputDetailsSubpanel from './InputDetailsSubpanel';
// import XYConfigPanel from './XYConfigPanel';
// import SwitchConfigSubpanel from './SwitchConfigSubpanel';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

type InputConfigurationProps = {
  config: DeviceConfigDTO;
  input: InputDTO;
};

export default function InputConfigPanel(props: InputConfigurationProps) {
  const { config, input } = props;

  let Element = null;
  switch (input.type) {
    case 'xy':
      // Element = <XYConfigPanel />;
      Element = null;
      break;
    case 'switch':
      Element = null;
      // Element = <SwitchConfigSubpanel />;
      break;
    default:
      Element = <MonoInputConfigPanel input={input} deviceId={config.id} />;
  }

  return (
    <>
      <InputDetailsSubpanel input={input} />
      {Element}
    </>
  );
}
