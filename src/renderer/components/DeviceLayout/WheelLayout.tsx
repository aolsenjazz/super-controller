type PropTypes = {
  max: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  width: string;
  height: string;
  handleWidth: string;
  handleHeight: string;
  horizontal: boolean;
  overrideable: boolean;
  onClick: (event: React.MouseEvent) => void;
};

/**
 * @callback onClick
 * @param event Mouse event
 */

/**
 * Graphical representation of a wheel input
 *
 * @param props Component props
 * @param props.max Maximum value the wheel can represent
 * @param props.value Current value represented by the wheel
 * @param props.enabled Should the wheel respond to click events?
 * @param props.focus Should the wheel be highlighted?
 * @param props.overrideable Can this input be overridden?
 * @param props.width CSS width attribute
 * @param props.height CSS height attribute
 * @param props.handleWidth CSS width attribute of the "grabbable" part of the input
 * @param props.handleHeight CSS height attribute of the "grabbable" part of the input
 * @param props.onClick Click listener for setting selected inputs
 */
export function WheelLayout(props: PropTypes) {
  const {
    width,
    height,
    max,
    value,
    enabled,
    focus,
    onClick,
    handleWidth,
    horizontal,
    handleHeight,
    overrideable,
  } = props;

  const boundingStyle = {
    bottom: `calc(${handleHeight} / 2)`,
    height: `calc(100% - ${handleHeight})`,
  };

  const shift = value / max;
  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(${handleWidth} - 2px)`,
    height: `calc(${handleHeight} + ${handleHeight} / 2 - 2px)`,
  };

  const transform = horizontal ? 'rotate(90deg)' : '';

  return (
    <div
      className={`wheel ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}${
        overrideable ? '' : 'disabled'
      }`}
      style={{ height, width, transform }}
      onClick={(e) => onClick(e)}
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
    >
      <div className="bounding-box" style={boundingStyle}>
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
