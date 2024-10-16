import { useMemo } from 'react';

import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { XYDriver } from '@shared/driver-types/input-drivers/xy-driver';
import { getQualifiedInputId, inputIdFromDriver } from '@shared/util';

type PropTypes = {
  handleWidth: string;
  handleHeight: string;
  id: string;
  driver: XYDriver;
};

function unipolarShift(midiValue: number) {
  return 25 + (midiValue / 127) * 50;
}

function bipolarShift(midiValue: number) {
  return 50 + (midiValue / 127) * 25;
}

function defaultVal(unipolar: boolean) {
  return unipolar ? 64 : 0;
}

export default function XYLayout(props: PropTypes) {
  const { handleWidth, handleHeight, id, driver } = props;

  const { xPolarity, yPolarity } = driver;
  const xUni = xPolarity === 'unipolar';
  const yUni = yPolarity === 'unipolar';

  const deviceId = id.split('::')[0];
  const xInputId = inputIdFromDriver(driver.x);
  const yInputId = inputIdFromDriver(driver.y);
  const xQualifiedId = getQualifiedInputId(deviceId, xInputId);
  const yQualifiedId = getQualifiedInputId(deviceId, yInputId);

  const recentX = useAppSelector(
    selectRecentRemoteMessagesById(xQualifiedId, 1)
  );
  const recentY = useAppSelector(
    selectRecentRemoteMessagesById(yQualifiedId, 1)
  );

  const state = useMemo(() => {
    return {
      x: {
        value: recentX.length ? recentX[0].msg[2] : defaultVal(xUni),
      },
      y: {
        value: recentY.length ? recentY[0].msg[2] : defaultVal(yUni),
      },
    };
  }, [recentX, recentY, xUni, yUni]);

  const xShift = xUni
    ? unipolarShift(state.x.value)
    : bipolarShift(state.x.value);
  const yShift = yUni
    ? unipolarShift(state.y.value)
    : bipolarShift(state.y.value);

  const iStyle = {
    marginLeft: -1,
    marginTop: -1,
    width: '100%',
    height: '100%',
  };

  return (
    <div
      className="xy interactive-indicator"
      tabIndex={0}
      onKeyDown={() => {}}
      role="button"
      style={{ position: 'relative' }}
    >
      <div
        style={{
          bottom: `${yShift}%`,
          left: `${xShift}%`,
          position: 'absolute',
          width: handleWidth,
          height: handleHeight,
          transform: 'translate(-50%, 50%)',
          opacity: 0.5, // Slightly faded
        }}
      >
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
      <div
        style={{
          bottom: `${yUni ? yShift : 100 - yShift}%`,
          left: `${xUni ? xShift : 100 - xShift}%`,
          position: 'absolute',
          width: handleWidth,
          transform: 'translate(-50%, 50%)',
          height: handleHeight,
          opacity: 0.5, // Slightly faded
        }}
      >
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}
