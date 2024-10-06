import { useSelector } from 'react-redux';

import { selectSelectedInputs } from '@features/selected-inputs/selected-inputs-slice';
import { InputDriver, InteractiveInputDriver } from '@shared/driver-types';
import { id } from '@shared/util';
import { selectSelectedDevice } from '@selectors/selected-device-selector';

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
  const selectedDevice = useSelector(selectSelectedDevice);
  const selectedInputs = useSelector(selectSelectedInputs);

  let Element;
  if (driver.interactive) {
    const inputIdStub = id(driver as InteractiveInputDriver);
    const inputId = `${selectedDevice!.id}-${inputIdStub}`;
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
        <InteractiveInputLayout
          deviceId={selectedDevice!.id}
          driver={driver as InteractiveInputDriver}
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
