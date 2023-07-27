import { SliderConfig } from '@shared/hardware-config/input-config';

type PropTypes = {
  x: SliderConfig;
  y: SliderConfig;
  handleWidth: string;
  handleHeight: string;
};

export default function XYLayout(props: PropTypes) {
  const { x, y, handleWidth, handleHeight } = props;

  const xShift = x.value / 127;
  const yShift = y.value / 127;

  const iStyle = {
    marginLeft: -1,
    marginTop: -1,
  };

  const xStyle =
    x.statusString === 'pitchbend'
      ? `calc(${xShift} * 50%)`
      : `calc(25% + 25% * ${xShift})`;

  const yStyle =
    y.statusString === 'pitchbend'
      ? `calc(50% + 25% * ${yShift})`
      : `calc(50% + 25% * ${yShift})`;

  return (
    <div
      className="xy interactive-indicator"
      tabIndex={0}
      onKeyDown={() => {}}
      style={{
        borderRadius: '100%',
      }}
      role="button"
    >
      <div
        style={{
          top: yStyle,
          left: xStyle,
          position: 'absolute',
          width: handleWidth,
          height: handleHeight,
          transform: `translate(0, -50%)`,
        }}
      >
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}
