type PropTypes = {
  value: number;
  handleWidth: string;
  handleHeight: string;
};

export function WheelLayout(props: PropTypes) {
  const { value, handleWidth, handleHeight } = props;

  const max = 127;
  const boundingStyle = {
    bottom: `calc(${handleHeight} / 2)`,
    height: `calc(100% - ${handleHeight})`,
  };

  const shift = value / max;
  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(${handleWidth} - 2px)`,
    height: `calc(${handleHeight} + ${handleHeight} / 2 - 2px)`,
  };

  return (
    <div className="wheel interactive-indicator">
      <div className="bounding-box" style={boundingStyle}>
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}
