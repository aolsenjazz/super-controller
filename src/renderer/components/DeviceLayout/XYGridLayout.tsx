import { SupportedDeviceConfig } from '@shared/hardware-config';
import { InputGridDriver, InputDriverWithHandle } from '@shared/driver-types';
import { id as driverId } from '@shared/util';

import XYLayout from './InteractiveInputLayout/XYLayout';

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
  deviceConfig: SupportedDeviceConfig;
  onClick: (e: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
};

export default function XYGridLayout(props: PropTypes) {
  const {
    inputGrid,
    deviceWidth,
    onClick,
    selectedInputs,
    deviceConfig,
    deviceHeight,
  } = props;

  const xInput = inputGrid.inputs[0] as InputDriverWithHandle;
  const yInput = inputGrid.inputs[1] as InputDriverWithHandle;

  const xId = driverId(xInput);
  const yId = driverId(yInput);

  const xConfig = deviceConfig.getInput(xId);
  const yConfig = deviceConfig.getInput(yId);

  if (!xConfig || !yConfig) throw new Error(`x or y input config is falsy`);

  const handleWidth = xInput.handleWidth as number;

  const igStyle = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={igStyle}>
      <div
        className="input-container"
        style={{
          width: `calc(100% / ${inputGrid.nCols})`,
          height: `calc(100% / ${inputGrid.nRows})`,
        }}
      >
        <XYLayout
          width={`${(xInput.width / inputGrid.width) * 100}%`}
          height={`${(xInput.height / inputGrid.height) * 100}%`}
          handleWidth={`${(handleWidth / xInput.width) * 100}%`}
          handleHeight={`${(handleWidth / xInput.height) * 100}%`}
          isXPitchbend={xInput.status === 'pitchbend'}
          isYPitchbend={yInput.status === 'pitchbend'}
          xMax={127}
          yMax={127}
          xValue={xConfig.value}
          yValue={yConfig.value}
          shape={xInput.shape ? xInput.shape : 'rect'}
          onClick={(e: React.MouseEvent) => {
            onClick(e, [xId, yId]);
          }}
          focus={selectedInputs.includes(xId)}
        />
      </div>
    </div>
  );
}
