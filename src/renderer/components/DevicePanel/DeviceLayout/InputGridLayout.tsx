import { SupportedDeviceConfig } from '@shared/hardware-config';
import { InputGridDriver } from '@shared/driver-types';

import InputLayout from './InputLayout';

type PropTypes = {
  grid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
  deviceConfig: SupportedDeviceConfig;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
};

const InputGridLayout = (props: PropTypes) => {
  const {
    grid,
    onClick,
    selectedInputs,
    deviceConfig,
    deviceHeight,
    deviceWidth,
  } = props;

  const style = {
    width: `${(grid.width / deviceWidth) * 100}%`,
    height: `${(grid.height / deviceHeight) * 100}%`,
    left: `${(grid.left / deviceWidth) * 100}%`,
    bottom: `${(grid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {grid.inputs.map((driver) => (
        <div
          className="input-container"
          key={`InputGrid[${grid.id}]`}
          style={{
            width: `calc(100% / ${grid.nCols})`,
            height: `calc(100% / ${grid.nRows})`,
          }}
        >
          <InputLayout
            deviceConfig={deviceConfig}
            driver={driver}
            width={`${(driver.width / (grid.width / grid.nCols)) * 100}%`}
            height={`${(driver.height / (grid.height / grid.nRows)) * 100}%`}
            selectedInputs={selectedInputs}
            onClick={onClick}
          />
        </div>
      ))}
    </div>
  );
};

export default InputGridLayout;
