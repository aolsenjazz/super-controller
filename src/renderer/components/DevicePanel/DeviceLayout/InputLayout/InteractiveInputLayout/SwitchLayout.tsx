type PropTypes = {
  lastStep: NumberArrayWithStatus | undefined;
  steps: NumberArrayWithStatus[];
};

export function SwitchLayout(props: PropTypes) {
  const { lastStep, steps } = props;

  const nSteps = steps.length;
  let stepIdx = 0;
  steps.forEach((s, i) => {
    if (JSON.stringify(s) === JSON.stringify(lastStep)) {
      stepIdx = i;
    }
  });

  console.log(stepIdx);

  const position = stepIdx / nSteps;
  const iStyle = {
    top: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / nSteps) * 100}%`,
  };

  return (
    <div className="switch interactive-indicator">
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}
