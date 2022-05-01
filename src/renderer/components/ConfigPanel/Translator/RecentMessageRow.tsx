import { useEffect, useState } from 'react';

import { getChannel, getStatus } from '@shared/midi-util';
import { MSG } from '@shared/ipc-channels';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

const { ipcRenderer } = window;

type RecentMessageRowPropTypes = {
  config: AnonymousDeviceConfig;
  setCurrentAction: (msg: number[]) => void;
  currentAction: number[] | null;
};

export default function RecentMessageRow(props: RecentMessageRowPropTypes) {
  const { config, setCurrentAction, currentAction } = props;

  const [recentMessage, setRecentMessage] = useState<number[] | null>(null);
  const selected =
    recentMessage &&
    JSON.stringify(currentAction) === JSON.stringify(recentMessage);

  useEffect(() => {
    const cb = (
      _e: Event,
      _inputId: string,
      deviceId: string,
      msg: number[]
    ) => {
      if (config.id !== deviceId) return;

      setRecentMessage(msg);

      if (JSON.stringify(msg) !== JSON.stringify(recentMessage))
        setCurrentAction(msg);
    };

    const unsubscribe = ipcRenderer.on(MSG, cb);

    return () => unsubscribe();
  }, [config, setCurrentAction, recentMessage]);

  if (recentMessage === null || config.getOverride(recentMessage)) return null;

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
          <p className="column event">{getStatus(recentMessage).string}</p>
          <p className="column number">{recentMessage[1]}</p>
          <p className="column channel">{getChannel(recentMessage)}</p>
        </>
      ) : null}
    </div>
  );
}
