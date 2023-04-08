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
  value: number;
  shape: string;
  endless: boolean;
};

export function Knob(props: PropTypes) {
  const { value, shape, endless } = props;

  const degrees = 270;
  const min = 0;
  const max = 127;
  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;

  const curDeg = Math.floor(
    convertRange(min, max, startAngle, endAngle, value)
  );

  return (
    <div className="knob" role="button">
      <div
        className="outer interactive-indicator"
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div className="inner" style={{ transform: `rotate(${curDeg}deg)` }}>
          {endless ? null : <div className="grip" />}
        </div>
      </div>
    </div>
  );
}
