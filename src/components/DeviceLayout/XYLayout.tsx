import React from 'react';

type PropTypes = {
  xMax: number;
  yMax: number;
  xValue: number;
  yValue: number;
  enabled: boolean;
  focus: boolean;
  width: string;
  height: string;
  shape: string;
  onClick: (event: React.MouseEvent) => void;
};

export default function XYLayout(props: PropTypes) {
  const {
    width,
    xMax,
    yMax,
    height,
    xValue,
    yValue,
    enabled,
    focus,
    onClick,
    shape,
  } = props;

  const xShift = xValue / xMax;
  const yShift = yValue / yMax;

  const iStyle = {
    bottom: `${yShift * 100}%`,
    left: `${xShift * 100}%`,
    width: `${width}`,
    height: `${height}`,
  };

  return (
    <div
      className={`xy ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}`}
      onClick={(e) => onClick(e)}
      tabIndex={0}
      onKeyDown={() => {}}
      style={{
        borderRadius: shape === 'circle' ? '100%' : '',
      }}
      role="button"
    >
      <div
        style={{
          top: `calc(${height} / 4)`,
          left: `calc(${width} / 4)`,
          position: 'absolute',
          width: `calc(100% - (${width}) / 2)`,
          height: `calc(100% - (${height}) / 2)`,
        }}
      >
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
