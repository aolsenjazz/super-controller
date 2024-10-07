import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';

import InputDetailsSubpanel from './InputDetailsSubpanel';
import BasicMessage from '../BasicMessage';
import { InputAggregate } from './input-aggregate';
// import XYConfigPanel from './XYConfigPanel';
// import SwitchConfigSubpanel from './SwitchConfigSubpanel';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';

function areInputsHomogenous(i: InputDTO[]) {
  if (i.length === 1) return true;
  return i.filter((c) => ['xy', 'switch'].includes(c.type)).length === 0;
}

type InputConfigurationProps = {
  config: DeviceConfigDTO;
  inputConfigs: InputDTO[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  const homogenous = areInputsHomogenous(inputConfigs);
  const aggregate = new InputAggregate(inputConfigs);

  let Element = null;
  switch (aggregate.type) {
    case 'xy':
      // Element = <XYConfigPanel />;
      break;
    case 'switch':
      // Element = <SwitchConfigSubpanel />;
      break;
    default:
      Element = (
        <MonoInputConfigPanel
          inputs={inputConfigs as MonoInputDTO[]}
          deviceId={config.id}
        />
      );
  }

  return (
    <>
      <InputDetailsSubpanel configs={inputConfigs} />
      {homogenous ? (
        Element
      ) : (
        <BasicMessage msg="The selected inputs have no overlap." />
      )}
    </>
  );
}
