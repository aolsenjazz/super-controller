import React from 'react';

type PropTypes = {
  size: number | string;
  min: number;
  max: number;
  degrees: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  shape: string | undefined;
  onClick: (event: React.MouseEvent) => void;
};

const convertRange = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  oldValue: number
) => {
  return ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

/* eslint-disable-next-line */
const dcpy = (o: any) => {
  return JSON.parse(JSON.stringify(o));
};

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
  } = props;

  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;

  const curDeg = Math.floor(
    convertRange(min, max, startAngle, endAngle, value)
  );

  const kStyle = {
    width: size,
    height: size,
  };
  const iStyle = dcpy(kStyle);
  const oStyle = dcpy(kStyle);
  iStyle.transform = `rotate(${curDeg}deg)`;

  return (
    <div
      className="knob"
      style={kStyle}
      onClick={(event) => onClick(event)}
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
    >
      <div
        className={`outer ${focus ? 'focus' : ''}`}
        role="button"
        tabIndex={0}
        style={{
          borderRadius: shape === 'circle' || !shape ? size : '',
          ...oStyle,
        }}
      >
        <div className={`inner ${enabled ? 'Hoverable' : ''}`} style={iStyle}>
          <div className="grip" />
        </div>
      </div>
    </div>
  );
}
