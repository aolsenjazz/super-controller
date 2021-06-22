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
  handleWidth: string;
  handleHeight: string;
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
    handleWidth,
    handleHeight,
  } = props;

  const xShift = xValue / xMax;
  const yShift = yValue / yMax;

  const iStyle = {
    width: `${width}`,
    height: `${height}`,
    marginLeft: -1,
    marginTop: -1,
  };

  return (
    <div
      className={`xy ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}`}
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
          top: `calc(50% + 25% * ${yShift})`,
          left: `calc(${xShift} * 50%)`,
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
