import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';
import { XYDTO } from '@shared/hardware-config/input-config/xy-config';

import InputDetailsSubpanel from './InputDetailsSubpanel';
// import SwitchConfigSubpanel from './SwitchConfigSubpanel';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';
import XYConfigPanel from './XYConfigPanel';

type InputConfigurationProps = {
  input: InputDTO;
};

export default function InputConfigPanel(props: InputConfigurationProps) {
  const { input } = props;

  let Element = null;
  switch (input.type) {
    case 'xy':
      Element = <XYConfigPanel input={input as XYDTO} />;
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
