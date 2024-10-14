import { XYDriver } from '@shared/driver-types/input-drivers/xy-driver';
import { useMemo } from 'react';
// import { useSelector } from 'react-redux';

// import { selectSelectedDevice } from '@selectors/selected-device-selector';

// import { XYState } from '@shared/hardware-config/input-config/xy-config';

type PropTypes = {
  handleWidth: string;
  handleHeight: string;
  id: string;
  driver: XYDriver;
};

export default function XYLayout(props: PropTypes) {
  const { handleWidth, handleHeight, id, driver } = props;

  // const selectedDevice = useSelector(selectSelectedDevice);
  const initialState = useMemo(() => {
    return {
      x: {
        value: 64,
      },
      y: {
        value: 64,
      },
    };
  }, []);

  // const { state } = useInputState<XYState>(
  //   selectedDevice!.id,
  //   id,
  //   initialState
  // );
  const state = initialState;

  if (state === undefined) return null;

  const xShift = state.x.value / 127;
  const yShift = state.y.value / 127;

  const iStyle = {
    marginLeft: -1,
    marginTop: -1,
    width: '100%',
    height: '100%',
  };

  const xStyle =
    driver.x.status === 'pitchbend'
      ? `calc(25% + ${xShift * 50}%)`
      : `calc(25% + 25% * ${xShift})`; // this is probably incorrect

  const yStyle =
    driver.y.status === 'pitchbend'
      ? `calc(50% + 50% * ${yShift})` // this is probably incorrect
      : `calc(50% + 25% * ${yShift})`;

  return (
    <div
      className="xy interactive-indicator"
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
    >
      <div
        style={{
          marginTop: yStyle,
          left: xStyle,
          position: 'absolute',
          width: handleWidth,
          height: handleHeight,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}
