import { SupportedDeviceConfig } from '@shared/hardware-config';
import {
  InputGridDriver,
  InputDriver,
  InteractiveInputDrivers,
  InteractiveInputDriver,
} from '@shared/driver-types';
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

function InputLayout(props: InputLayoutPropTypes) {
  const { driver, deviceConfig, width, height, onClick, selectedInputs } =
    props;

  let Element;
  if (driver.interactive) {
    const inputId = id(driver as InteractiveInputDrivers);
    const config = deviceConfig.getInput(inputId);
    const focus = selectedInputs.includes(inputId);

    if (config === undefined) throw new Error('this shouldnt happen');

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

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
  deviceConfig: SupportedDeviceConfig;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
};

const InputGridLayout = (props: PropTypes) => {
  const {
    inputGrid,
    onClick,
    selectedInputs,
    deviceConfig,
    deviceHeight,
    deviceWidth,
  } = props;

  const style = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {inputGrid.inputs.map((driver, i) => (
        <div
          className="input-container"
          // eslint-disable-next-line react/no-array-index-key
          key={`InputGrid[${i}]`}
          style={{
            width: `calc(100% / ${inputGrid.nCols})`,
            height: `calc(100% / ${inputGrid.nRows})`,
          }}
        >
          <InputLayout
            deviceConfig={deviceConfig}
            driver={driver}
            width={`${
              (driver.width / (inputGrid.width / inputGrid.nCols)) * 100
            }%`}
            height={`${
              (driver.height / (inputGrid.height / inputGrid.nRows)) * 100
            }%`}
            selectedInputs={selectedInputs}
            onClick={onClick}
          />
        </div>
      ))}
    </div>
  );
};

export default InputGridLayout;
