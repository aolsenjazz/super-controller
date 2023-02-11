/**
 * Converts a value in given range to the equivalent value in a new range
 *
 * @param oldMin Minimum value of old range
 * @param oldMax Maximum value of old range
 * @param newMin Minimum value of new range
 * @param newMax Maximum value of new range
 * @param value The value to convert
 */
const convertRange = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  value: number
) => {
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

type PropTypes = {
  size: number | string;
  min: number;
  max: number;
  degrees: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  shape: string;
  overrideable: boolean;
  endless: boolean;
  onClick: (event: React.MouseEvent) => void;
};

/**
 * @callback onClick
 * @param event Click event
 */

/**
 * Graphical representation of a knob
 *
 * @param props Component props
 * @param props.size CSS size of knob
 * @param props.min Minimum value knob can represent
 * @param props.max Maximum value knob can represent
 * @param props.degrees Number of degrees the knob can be rotated
 * @param props.value Value currently represented by the knob
 * @param props.enabled Can be the knob be clicked?
 * @param props.focus Should the knob be highlighted?
 * @param props.overrideable Can this control be overridden?
 * @param props.shape What is the shape of the knob? probably 'circ'
 * @param props.onClick Click listener to set selected inputs
 */
export function Knob(props: PropTypes) {
  const {
    size,
    min,
    max,
    degrees,
    value,
    focus,
    enabled,
    shape,
    onClick,
    overrideable,
    endless,
  } = props;

  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;

  const curDeg = Math.floor(
    convertRange(min, max, startAngle, endAngle, value)
  );

  const layoutDimens = /(circle|square)/.test(shape)
    ? { width: `${size}`, aspectRatio: '1' }
    : { width: `${size}`, height: `${size}` };

  return (
    <div
      className="knob"
      style={layoutDimens}
      onClick={(event) => onClick(event)}
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
    >
      <div
        className={`outer ${focus ? 'focus' : ''} ${
          overrideable ? '' : 'disabled'
        }`}
        role="button"
        tabIndex={0}
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div
          className={`inner ${enabled ? 'hoverable' : ''}`}
          style={{ transform: `rotate(${curDeg}deg)` }}
        >
          {endless ? null : <div className="grip" />}
        </div>
      </div>
    </div>
  );
}
