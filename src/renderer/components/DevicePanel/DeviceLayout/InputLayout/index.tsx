import { SupportedDeviceConfig } from '@shared/hardware-config';
import { InputDriver, InteractiveInputDriver } from '@shared/driver-types';
import { id } from '@shared/util';

import InteractiveInputLayout from './InteractiveInputLayout';
import NoninteractiveInputLayout from './NoninteractiveInputLayout';

type InputLayoutPropTypes = {
  driver: InputDriver;
  deviceConfig: SupportedDeviceConfig;
  width: string;
  height: string;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
};

export default function InputLayout(props: InputLayoutPropTypes) {
  const { driver, deviceConfig, width, height, onClick, selectedInputs } =
    props;

  let Element;
  if (driver.interactive) {
    const inputId = id(driver as InteractiveInputDriver);
    const config = deviceConfig.getInput(inputId);
    const focus = selectedInputs.includes(inputId);

    if (config === undefined)
      throw new Error(
        `Unable to locate config for input id ${inputId}. This probably happened because of a failure in updating an old project.`
      );

    Element = (
      <div
        className={`input-wrapper ${focus ? 'focus' : ''}`}
        onClick={(e: React.MouseEvent) => onClick(e, [inputId])}
        role="presentation"
        style={{
          width,
          height,
        }}
      >
        <InteractiveInputLayout
          driver={driver as InteractiveInputDriver}
          config={config}
        />
      </div>
    );
  } else {
    Element = (
      <div
        className="input-wrapper"
        style={{
          width,
          height,
        }}
      >
        <NoninteractiveInputLayout shape={driver.shape} />
      </div>
    );
  }

  return Element;
}
