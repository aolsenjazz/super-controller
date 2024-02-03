import { useSelectedDevice } from '@context/selected-device-context';
import { useInputConfig } from '@hooks/use-input-config';
import { useInputState } from '@hooks/use-input-state';
import {
  KnobConfigStub,
  KnobState,
} from '@shared/hardware-config/input-config/knob-config';
import { useEffect, useState } from 'react';

const defaultState = {
  value: 0 as MidiNumber,
};

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
  const { selectedDevice } = useSelectedDevice();
  const [curDeg, setCurDeg] = useState(0);

  const { inputConfig } = useInputConfig<KnobConfigStub>(
    selectedDevice || '',
    id
  );

  const [isEndless, setEndless] = useState(endless);

  useEffect(() => {
    if (inputConfig) setEndless(inputConfig.valueType === 'endless');
  }, [inputConfig]);

  const { state } = useInputState<KnobState>(
    selectedDevice || '',
    id,
    defaultState
  );

  useEffect(() => {
    const degrees = 270;
    const min = 0;
    const max = 127;
    const startAngle = (360 - degrees) / 2;
    const endAngle = startAngle + degrees;

    setCurDeg(
      Math.floor(convertRange(min, max, startAngle, endAngle, state.value))
    );
  }, [state]);

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
