import { SupportedDeviceConfig, InputConfig } from '@shared/hardware-config';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';

import { VirtualInput, VirtualInputGrid } from '../../virtual-devices';

type ElementPropTypes = {
  input: VirtualInput;
  config: InputConfig | undefined; // TODO this isn't good
  width: string;
  height: string;
  focus: boolean;
  overrideable: boolean;
  onClick: (event: React.MouseEvent, id: string) => void;
};

/**
 * @callback onClick
 * @param event Click event
 * @param id Id of the input
 */

/**
 * Returns an element basic on input configuration
 *
 * @param props Component props
 * @param props.input Contains layout information + driver for an input
 * @param props.config Configuration for input control
 * @param props.width CSS width of the input
 * @param props.height CSS height of the input
 * @param props.focus Should this control be highlighted?
 * @param props.overrideable Can this input be overridden?
 * @param props.onClick Click listener for setting selected inputs
 */
function Element(props: ElementPropTypes) {
  const { input, config, width, height, onClick, focus, overrideable } = props;

  const handleWidth = input.handleWidth as number;

  let elem;
  if (input.type === 'pad') {
    elem = (
      <Pad
        id={input.id}
        shape={input.shape}
        width={width}
        height={height}
        fx={config?.currentFx}
        onClick={(e) => onClick(e, input.id)}
        color={config?.currentColor}
        enabled={overrideable}
        focus={focus}
        overrideable={overrideable}
      />
    );
  } else if (input.type === 'knob') {
    const val = config?.value || 0;
    elem = (
      <Knob
        size={width}
        min={0}
        max={127}
        degrees={270}
        value={val}
        onClick={(e) => onClick(e, input.id)}
        enabled={overrideable}
        focus={focus}
        shape={input.shape}
        endless={config?.valueType === 'endless'}
        overrideable={overrideable}
      />
    );
  } else {
    const val = config?.value || 0;
    elem = (
      <WheelLayout
        max={127}
        value={val}
        width={width}
        handleWidth={`${(handleWidth / input.width) * 100}%`}
        handleHeight={`${(handleWidth / input.height) * 100}%`}
        height={height}
        enabled={overrideable}
        style={input.style}
        focus={focus}
        overrideable={overrideable}
        onClick={(e) => onClick(e, input.id)}
      />
    );
  }

  return elem;
}

type PropTypes = {
  inputGrid: VirtualInputGrid;
  deviceWidth: number;
  deviceHeight: number;
  configured: boolean;
  deviceConfig: SupportedDeviceConfig;
  onClick: (event: React.MouseEvent, ids: string[]) => void;
  selectedInputs: string[];
};

/**
 * @callback onClick
 * @param event Click event
 * @param ids Newly-selected input IDs
 */

/**
 * Contains a grid of input single-config VirtualInputs.
 *
 * @param props Component props
 * @param props.deviceWidth Width of device (in inches)
 * @param props.deviceHeight Height of device (in inches)
 * @param props.deviceConfig Configuration for parent device
 * @param props.onClick Click callback for setting selected IDs
 * @param props.selectedInputs The currently-selected inputs
 */
const InputGridLayout = (props: PropTypes) => {
  const {
    inputGrid,
    deviceWidth,
    onClick,
    selectedInputs,
    configured,
    deviceConfig,
    deviceHeight,
  } = props;

  const style = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {inputGrid.inputs.map((input) => {
        const inputConfig = deviceConfig.getInput(input.id);

        return (
          <div
            className="input-container"
            key={input.id}
            style={{
              width: `calc(100% / ${inputGrid.nCols})`,
              height: `calc(100% / ${inputGrid.nRows})`,
            }}
          >
            <Element
              width={`${
                (input.width / (inputGrid.width / inputGrid.nCols)) * 100
              }%`}
              height={`${
                (input.height / (inputGrid.height / inputGrid.nRows)) * 100
              }%`}
              input={input}
              config={inputConfig}
              overrideable={input.overrideable && configured}
              onClick={(_e, id: string) => {
                if (input.overrideable && configured) onClick(_e, [id]);
              }}
              focus={selectedInputs.includes(input.id)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default InputGridLayout;
