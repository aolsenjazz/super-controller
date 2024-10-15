import { TimestampedMidiEvent } from '@shared/timestamped-midi-event';
import { useState, useEffect } from 'react';
import './Knob.css';

type EndlessKnobProps = {
  recentMessage?: TimestampedMidiEvent;
  shape?: string;
};

export function EndlessKnob({ recentMessage, shape }: EndlessKnobProps) {
  const [accumulatedRotation, setAccumulatedRotation] = useState(0);

  useEffect(() => {
    if (!recentMessage) return;

    const rotation = recentMessage.msg[2] > 64 ? 10 : -10;
    setAccumulatedRotation((acc) => acc + rotation);
  }, [recentMessage]);

  return (
    <div className="knob" role="button">
      <div
        className="outer interactive-indicator"
        style={{
          borderRadius: shape === 'circle' || !shape ? '100%' : '',
        }}
      >
        <div
          className="inner"
          style={{ transform: `rotate(${accumulatedRotation}deg)` }}
        >
          <div className="endless-indicator" />
        </div>
      </div>
    </div>
  );
}
