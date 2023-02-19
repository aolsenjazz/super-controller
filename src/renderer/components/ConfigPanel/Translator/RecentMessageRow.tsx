import { useEffect, useState } from 'react';

import { MidiArray, create, ThreeByteMidiArray } from '@shared/midi-array';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

const { hostService } = window;

type RecentMessageRowPropTypes = {
  config: AnonymousDeviceConfig;
  setCurrentAction: (msg: MidiArray) => void;
  currentAction: MidiArray | undefined;
};

export default function RecentMessageRow(props: RecentMessageRowPropTypes) {
  const { config, setCurrentAction, currentAction } = props;

  const [recentMessage, setRecentMessage] = useState<MidiArray | undefined>(
    undefined
  );
  const selected =
    recentMessage &&
    JSON.stringify(currentAction) === JSON.stringify(recentMessage);

  useEffect(() => {
    const cb = (
      _inputId: string,
      deviceId: string,
      arr: NumberArrayWithStatus
    ) => {
      if (config.id !== deviceId) return;

      const msg = create(arr);
      setRecentMessage(msg);

      if (JSON.stringify(msg) !== JSON.stringify(recentMessage))
        setCurrentAction(msg);
    };

    const unsubscribe = hostService.onMessage(cb);

    return () => unsubscribe();
  }, [config, setCurrentAction, recentMessage]);

  if (recentMessage === undefined || config.getOverride(recentMessage))
    return null;

  return (
    <div
      className={`row recent ${selected ? 'selected' : ''}`}
      onClick={() => setCurrentAction(recentMessage)}
      onKeyDown={() => {}}
      tabIndex={0}
      role="button"
    >
      {recentMessage ? (
        <>
          <p className="column event">{recentMessage.statusString}</p>
          <p className="column number">
            {(recentMessage as ThreeByteMidiArray).number}
          </p>
          <p className="column channel">
            {(recentMessage as ThreeByteMidiArray).channel}
          </p>
        </>
      ) : null}
    </div>
  );
}
