type PropTypes = {
  lastStep: NumberArrayWithStatus | undefined;
  steps: NumberArrayWithStatus[];
  style: { transform?: string } | undefined;
};

export function SwitchLayout(props: PropTypes) {
  const { lastStep, steps, style } = props;

  const nSteps = steps.length;
  let stepIdx = 0;
  steps.forEach((s, i) => {
    if (JSON.stringify(s) === JSON.stringify(lastStep)) {
      stepIdx = i;
    }
  });

  const position = stepIdx / nSteps;
  const iStyle = {
    bottom: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / nSteps) * 100}%`,
  };

  return (
    <div className="switch interactive-indicator" style={style}>
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}
