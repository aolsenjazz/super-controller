import React from 'react';

type PropTypes = {
  max: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  width: string;
  height: string;
  handleWidth: string;
  handleHeight: string;
  onClick: (event: React.MouseEvent) => void;
};

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
    handleHeight,
  } = props;

  const shift = value / max;

  const oStyle = {
    width,
    height,
  };

  const boundingStyle = {
    bottom: `calc(${handleHeight} / 2)`,
    height: `calc(100% - ${handleHeight})`,
  };

  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(${handleWidth} - 2px)`,
    height: `calc(${handleHeight} + ${handleHeight} / 2 - 2px)`,
  };

  return (
    <div
      className={`wheel ${enabled ? 'hoverable' : ''} ${focus ? 'focus' : ''}`}
      style={oStyle}
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
