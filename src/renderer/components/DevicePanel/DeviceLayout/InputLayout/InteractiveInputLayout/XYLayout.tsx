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

export default function XYLayout(props: PropTypes) {
  const { handleWidth, handleHeight, id, driver } = props;

  const xInputId = inputIdFromDriver(driver.x);
  const yInputId = inputIdFromDriver(driver.y);
  const xQualifiedId = getQualifiedInputId(id, xInputId);
  const yQualifiedId = getQualifiedInputId(id, yInputId);

  const recentX = useAppSelector(
    selectRecentRemoteMessagesById(xQualifiedId, 1)
  );
  const recentY = useAppSelector(
    selectRecentRemoteMessagesById(yQualifiedId, 1)
  );

  const state = useMemo(() => {
    return {
      x: {
        value: recentX.length ? recentX[0].msg[2] : 64,
      },
      y: {
        value: recentY.length ? recentY[0].msg[2] : 64,
      },
    };
  }, [recentX, recentY]);

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
