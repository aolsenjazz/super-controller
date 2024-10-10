import { useMemo } from 'react';

import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';

/**
 * Converts a value in given range to the equivalent value in a new range
 *
 * @param oldMin Minimum value of old range
 * @param oldMax Maximum value of old range
 * @param newMin Minimum value of new range
 * @param newMax Maximum value of new range
 * @param value The value to convert
 */
const convertRange = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  value: number
) => {
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

type PropTypes = {
  id: string;
  shape: string;
  endless: boolean;
};

export function Knob(props: PropTypes) {
  const { shape, endless, id } = props;

  const lastMsg = useAppSelector(selectRecentRemoteMessagesById(id, 1));
  const value = lastMsg.length === 1 ? lastMsg[0][2] : 64;

  const curDeg = useMemo(() => {
    const degrees = 270;
    const min = 0;
    const max = 127;
    const startAngle = (360 - degrees) / 2;
    const endAngle = startAngle + degrees;

    return Math.floor(convertRange(min, max, startAngle, endAngle, value));
  }, [value]);

  return (
    <div className="knob" role="button">
      <div
        className="outer interactive-indicator"
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div className="inner" style={{ transform: `rotate(${curDeg}deg)` }}>
          {endless ? null : <div className="grip" />}
        </div>
      </div>
    </div>
  );
}
