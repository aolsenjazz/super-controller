type PropTypes = {
  value: number;
  handleWidth: string;
  handleHeight: string;
};

export function HorizontalHandleLayout(props: PropTypes) {
  const { value, handleWidth, handleHeight } = props;

  const max = 127;
  const boundingStyle = {
    left: `calc(${handleWidth} / 2)`,
    width: `calc(100% - ${handleWidth})`,
    height: `100%`,
  };

  const shift = value / max;
  const iStyle = {
    left: `${shift * 100}%`,
    bottom: 0,
    height: `calc(${handleHeight} - 2px)`,
    width: `calc(${handleWidth} + ${handleWidth} / 2 - 2px)`,
  };

  return (
    <div className="bounding-box" style={boundingStyle}>
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}
