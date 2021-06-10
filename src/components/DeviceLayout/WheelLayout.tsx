import React from 'react';

type PropTypes = {
  max: number;
  value: number;
  enabled: boolean;
  focus: boolean;
  width: string;
  height: string;
  onClick: (event: React.MouseEvent) => void;
};

export function WheelLayout(props: PropTypes) {
  const { width, height, max, value, enabled, focus, onClick } = props;

  const shift = value / max;

  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(100% - 2px)`,
    height: `calc(${width} - 2px)`,
  };

  const oStyle = {
    width,
    height,
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
      <div
        style={{
          top: `calc(${width} / 2)`,
          position: 'absolute',
          width: '100%',
          height: `calc(100% - ${width}px)`,
        }}
      >
        <div className={`inner `} style={iStyle} />
      </div>
    </div>
  );
}
