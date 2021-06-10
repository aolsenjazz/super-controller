import React from 'react';

type PropTypes = {
  xMax: number;
  yMax: number;
  xValue: number;
  yValue: number;
  enabled: boolean;
  focus: boolean;
  width: number;
  height: number;
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
    width: `${width}px`,
    height: `${height}px`,
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
          top: width / 2,
          left: width / 2,
          position: 'absolute',
          width: `calc(100% - ${width}px)`,
          height: `calc((100% - ${width}px) / 2)`,
        }}
      >
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
