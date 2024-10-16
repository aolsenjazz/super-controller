import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';

import InputDetailsSubpanel from './InputDetailsSubpanel';
// import XYConfigPanel from './XYConfigPanel';
// import SwitchConfigSubpanel from './SwitchConfigSubpanel';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

type InputConfigurationProps = {
  input: InputDTO;
};

export default function InputConfigPanel(props: InputConfigurationProps) {
  const { input } = props;

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
      Element = <MonoInputConfigPanel input={input as MonoInputDTO} />;
  }

  return (
    <>
      <InputDetailsSubpanel input={input} />
      {Element}
    </>
  );
}
