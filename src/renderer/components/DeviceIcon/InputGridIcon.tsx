import { InputGridDriver } from '@shared/driver-types/input-grid-driver';

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
};

/**
 * Simplified graphical representation of an InputGrid containing input controls
 *
 * @param props Component props
 * @param props.inputGrid Driver for this InputGrid
 * @param props.deviceWidth Width (in inches) of this device
 * @param props.deviceHeight Height (in inches) of this device
 */
const InputGridIcon = (props: PropTypes) => {
  const { inputGrid, deviceWidth, deviceHeight } = props;

  const igStyle = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={igStyle}>
      {inputGrid.inputs.map((input, i) => {
        const { width, height } = input;

        return (
          <div
            className="input-container"
            // eslint-disable-next-line react/no-array-index-key
            key={`noninteractive[${i}]`} // gross, but arr won't change
            style={{
              width: `calc(100% / ${inputGrid.nCols})`,
              height: `calc(100% / ${inputGrid.nRows})`,
            }}
          >
            <div
              className="pad"
              style={{
                borderRadius: input.shape === 'circle' ? '100%' : '',
                width: `${
                  (width / (inputGrid.width / inputGrid.nCols)) * 100
                }%`,
                height: `${
                  (height / (inputGrid.height / inputGrid.nRows)) * 100
                }%`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputGridIcon;
