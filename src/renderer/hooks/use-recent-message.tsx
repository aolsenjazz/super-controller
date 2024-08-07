import { create, MidiArray } from '@shared/midi-array';
import { useState, useEffect } from 'react';

const { HostService } = window;

export const useRecentMessage = (deviceId: string) => {
  const [recentMsg, setRecentMsg] = useState<MidiArray>();

  useEffect(() => {
    const cb = (msg: NumberArrayWithStatus) => {
      setRecentMsg(create(msg));
    };

    const off = HostService.onMessage(deviceId, cb);

    return () => off();
  }, [deviceId]);

  return { recentMsg };
};
