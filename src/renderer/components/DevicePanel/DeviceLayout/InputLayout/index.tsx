import { useSelector } from 'react-redux';

import { selectSelectedInputId } from '@features/selected-input-id/selected-input-id-slice';
import { inputIdFromDriver, getQualifiedInputId } from '@shared/util';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { BaseInputDriver } from '@shared/driver-types/input-drivers/base-input-driver';
import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';

import InteractiveInputLayout from './InteractiveInputLayout';
import NoninteractiveInputLayout from './NoninteractiveInputLayout';

type InputLayoutPropTypes = {
  driver: BaseInputDriver;
  width: string;
  height: string;
  onClick: (e: React.MouseEvent, id: string) => void;
};

export default function InputLayout(props: InputLayoutPropTypes) {
  const { driver, width, height, onClick } = props;
  const selectedDevice = useSelector(selectSelectedDevice);
  const selectedInput = useSelector(selectSelectedInputId);

  let Element;
  if (driver.interactive) {
    const inputId = inputIdFromDriver(driver as InteractiveInputDriver);
    const qualifiedInputId = getQualifiedInputId(selectedDevice!.id, inputId);
    const focus = selectedInput === qualifiedInputId;

    Element = (
      <div
        className={`input-wrapper ${focus ? 'focus' : ''}`}
        onClick={(e: React.MouseEvent) => onClick(e, qualifiedInputId)}
        role="presentation"
        style={{
          width,
          height,
        }}
      >
        <InteractiveInputLayout
          qualifiedInputId={qualifiedInputId}
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
