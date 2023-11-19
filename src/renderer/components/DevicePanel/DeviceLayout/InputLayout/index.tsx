import { InputDriver, InteractiveInputDriver } from '@shared/driver-types';
import { id } from '@shared/util';
import { useSelectedInputs } from '../../../../context/selected-inputs-context';

import InteractiveInputLayout from './InteractiveInputLayout';
import NoninteractiveInputLayout from './NoninteractiveInputLayout';

type InputLayoutPropTypes = {
  driver: InputDriver;
  width: string;
  height: string;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
};

export default function InputLayout(props: InputLayoutPropTypes) {
  const { driver, width, height, onClick } = props;
  const { selectedInputs } = useSelectedInputs();

  let Element;
  if (driver.interactive) {
    const inputId = id(driver as InteractiveInputDriver);
    const focus = selectedInputs.includes(inputId);

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
        <InteractiveInputLayout driver={driver as InteractiveInputDriver} />
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
