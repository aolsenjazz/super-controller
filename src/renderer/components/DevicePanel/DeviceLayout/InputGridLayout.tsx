import { InputGridDriver } from '@shared/driver-types/input-grid-driver';

import InputLayout from './InputLayout';

type PropTypes = {
  grid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
};

const InputGridLayout = (props: PropTypes) => {
  const { grid, onClick, deviceHeight, deviceWidth } = props;

  const style = {
    width: `${(grid.width / deviceWidth) * 100}%`,
    height: `${(grid.height / deviceHeight) * 100}%`,
    left: `${(grid.left / deviceWidth) * 100}%`,
    bottom: `${(grid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {grid.inputs.map((driver, i) => (
        <div
          className="input-container"
          // eslint-disable-next-line react/no-array-index-key
          key={`Input[${i}]`}
          style={{
            width: `calc(100% / ${grid.nCols})`,
            height: `calc(100% / ${grid.nRows})`,
          }}
        >
          <InputLayout
            driver={driver}
            width={`${(driver.width / (grid.width / grid.nCols)) * 100}%`}
            height={`${(driver.height / (grid.height / grid.nRows)) * 100}%`}
            onClick={onClick}
          />
        </div>
      ))}
    </div>
  );
};

export default InputGridLayout;
