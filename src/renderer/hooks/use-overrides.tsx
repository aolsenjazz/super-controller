import { MidiArray } from '@shared/midi-array';
import { useState, useEffect } from 'react';

const { TranslatorService } = window;

export const useOverrides = (deviceId: string) => {
  const [overrides, setOverrides] = useState<Map<string, MidiArray>>();

  useEffect(() => {
    const cb = (o: Map<string, MidiArray>) => {
      setOverrides(o);
    };

    const off = TranslatorService.onOverridesChange(deviceId, cb);

    return () => off();
  }, [deviceId]);

  return { overrides };
};
