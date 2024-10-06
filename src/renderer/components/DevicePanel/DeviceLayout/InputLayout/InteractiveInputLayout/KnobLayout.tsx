import { selectById } from '@features/input-configs/input-configs-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { KnobDTO } from '@shared/hardware-config/input-config/knob-config';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const { InputConfigService } = window;

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
  const config = useAppSelector((state) => selectById(state, id));

  const [curDeg, setCurDeg] = useState(127);
  const [isEndless, setEndless] = useState(endless);

  const updateCurDeg = useCallback((msg: NumberArrayWithStatus) => {
    const degrees = 270;
    const min = 0;
    const max = 127;
    const startAngle = (360 - degrees) / 2;
    const endAngle = startAngle + degrees;

    setCurDeg(Math.floor(convertRange(min, max, startAngle, endAngle, msg[2])));
  }, []);

  useEffect(() => {
    if (!config) return () => {};
    const asKnob = config as KnobDTO;
    setEndless(asKnob.valueType === 'endless');

    const def = asKnob.defaults;
    const off = InputConfigService.onInputEvent(
      config.id,
      def.statusString,
      def.channel,
      def.number,
      updateCurDeg
    );

    return () => off();
  }, [config, updateCurDeg]);

  useEffect(() => {}, []);

  return (
    <div className="knob" role="button">
      <div
        className="outer interactive-indicator"
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div className="inner" style={{ transform: `rotate(${curDeg}deg)` }}>
          {isEndless ? null : <div className="grip" />}
        </div>
      </div>
    </div>
  );
}
