type PropTypes = {
  isXPitchbend: boolean;
  isYPitchbend: boolean;
  xMax: number;
  yMax: number;
  xValue: number;
  yValue: number;
  enabled: boolean;
  focus: boolean;
  overrideable: boolean;
  width: string;
  height: string;
  handleWidth: string;
  handleHeight: string;
  shape: string;
  onClick: (event: React.MouseEvent) => void;
};

/**
 * @callback onClick
 * @param event Mouse event
 */

/**
 * Graphical representation of an XYLayout. Assumes 0-values are at center
 *
 * @param Component props
 * @param props.xMax Max value that can be represented on the x-axis
 * @param props.yMax Max value than can be represented on the y-axis
 * @param props.xValue Value currently represented by the x-axis
 * @param props.yValue Value currently represented by the y-axis
 * @param props.enabled Should the input respond to click events?
 * @param props.focus Should the input be highlighted?
 * @param props.overrideable Can this input be overriden?
 * @param props.width CSS width attribute
 * @param props.height CSS height attribute
 * @param props.handleWidth CSS width attribute of the "grabbable" portion of input
 * @param props.handleHeight CSS height attribute of the "grabbable" portion of input
 * @param props.shape 'circle' | 'square' | 'rect'
 * @param props.onClick Click listener to set selected inputs
 */
export default function XYLayout(props: PropTypes) {
  const {
    width,
    isXPitchbend,
    isYPitchbend,
    xMax,
    yMax,
    height,
    xValue,
    yValue,
    enabled,
    focus,
    onClick,
    shape,
    handleWidth,
    handleHeight,
    overrideable,
  } = props;

  const xShift = xValue / xMax;
  const yShift = yValue / yMax;

  const iStyle = {
    width: `${width}`,
    height: `${height}`,
    marginLeft: -1,
    marginTop: -1,
  };

  const xStyle = isXPitchbend
    ? `calc(${xShift} * 50%)`
    : `calc(25% + 25% * ${xShift})`;

  const yStyle = isYPitchbend
    ? `calc(50% + 25% * ${yShift})`
    : `calc(50% + 25% * ${yShift})`;

  return (
    <div
      className={`xy ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}${
        overrideable ? '' : 'disabled'
      }`}
      onClick={(e) => onClick(e)}
      tabIndex={0}
      onKeyDown={() => {}}
      style={{
        borderRadius: shape === 'circle' ? '100%' : '',
        height,
        width,
      }}
      role="button"
    >
      <div
        style={{
          top: yStyle,
          left: xStyle,
          position: 'absolute',
          width: handleWidth,
          height: handleHeight,
          transform: `translate(0, -50%)`,
        }}
      >
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
