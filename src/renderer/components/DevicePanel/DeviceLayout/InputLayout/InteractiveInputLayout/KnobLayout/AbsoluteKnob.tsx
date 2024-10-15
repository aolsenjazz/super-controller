import { useMemo } from 'react';
import './Knob.css';

type AbsoluteKnobProps = {
  value: number;
  shape?: string;
};

const convertRange = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  v: number
) => {
  return ((v - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

export function AbsoluteKnob({ value, shape }: AbsoluteKnobProps) {
  const curDeg = useMemo(() => {
    const degrees = 270;
    const min = 0;
    const max = 127;
    const startAngle = (360 - degrees) / 2;
    const endAngle = startAngle + degrees;

    return Math.floor(convertRange(min, max, startAngle, endAngle, value));
  }, [value]);

  return (
    <div className="knob" role="button">
      <div
        className="outer interactive-indicator"
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div className="inner" style={{ transform: `rotate(${curDeg}deg)` }}>
          <div className="grip" />
        </div>
      </div>
    </div>
  );
}
