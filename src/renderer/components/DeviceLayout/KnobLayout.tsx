/**
 * Converts a value in given range to the equivalent value in a new range
 *
 * @param { number } oldMin Minimum value of old range
 * @param { number } oldMax Maximum value of old range
 * @param { number } newMin Minimum value of new range
 * @param { number } newMax Maximum value of new range
 * @param { number } value The value to convert
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
  onClick: (event: React.MouseEvent) => void;
};

/**
 * @callback onClick
 * @param { React.MouseEvent } event Click event
 */

/**
 * Graphical representation of a knob
 *
 * @param { object } props Component props
 * @param { number | string } props.size CSS size of knob
 * @param { number } props.min Minimum value knob can represent
 * @param { number } props.max Maximum value knob can represent
 * @param { number } props.degrees Number of degrees the knob can be rotated
 * @param { number } props.value Value currently represented by the knob
 * @param { boolean } props.enabled Can be the knob be clicked?
 * @param { boolean } props.focus Should the knob be highlighted?
 * @param { boolean } props.overrideable Can this control be overridden?
 * @param { string } props.shape What is the shape of the knob? probably 'circ'
 * @param { onClick } props.onClick Click listener to set selected inputs
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
          <div className="grip" />
        </div>
      </div>
    </div>
  );
}
