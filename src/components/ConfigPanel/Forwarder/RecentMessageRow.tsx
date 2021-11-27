import React, { useEffect, useState } from 'react';
import { MidiMessage, MidiValue } from 'midi-message-parser';

import { ipcRenderer } from 'electron';
import { MSG_CHANNEL } from '../../../ipc-channels';

import { AnonymousDeviceConfig } from '../../../hardware-config';

type RecentMessageRowPropTypes = {
  config: AnonymousDeviceConfig;
  setCurrentAction: (msg: MidiValue[]) => void;
  currentAction: MidiValue[] | null;
};

export default function RecentMessageRow(props: RecentMessageRowPropTypes) {
  const { config, setCurrentAction, currentAction } = props;

  const [recentMessage, setRecentMessage] = useState<MidiValue[] | null>(null);
  const selected =
    recentMessage &&
    JSON.stringify(currentAction) === JSON.stringify(recentMessage);
  const [recentMm, setRecentMm] = useState<MidiMessage | null>(null);

  useEffect(() => {
    const cb = (
      _e: Event,
      _inputId: string,
      deviceId: string,
      msg: MidiValue[]
    ) => {
      if (config.id !== deviceId) return;

      setRecentMessage(msg);

      if (JSON.stringify(msg) !== JSON.stringify(recentMessage))
        setCurrentAction(msg);
    };

    ipcRenderer.on(MSG_CHANNEL, cb);

    return () => {
      ipcRenderer.removeListener(MSG_CHANNEL, cb);
    };
  }, [config, setCurrentAction, recentMessage]);

  useEffect(() => {
    if (recentMessage) setRecentMm(new MidiMessage(recentMessage, 0));
  }, [recentMessage]);

  if (
    recentMessage === null ||
    config.overrides.get(JSON.stringify(recentMessage))
  )
    return null;

  return (
    <div
      className={`row recent ${selected ? 'selected' : ''}`}
      onClick={() => setCurrentAction(recentMessage)}
      onKeyDown={() => {}}
      tabIndex={0}
      role="button"
    >
      <p className="column event">{recentMm?.type}</p>
      <p className="column number">{recentMm?.number}</p>
      <p className="column channel">{recentMm?.channel}</p>
    </div>
  );
}
