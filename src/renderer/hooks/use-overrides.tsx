import { MidiArray } from '@shared/midi-array';
import { useState, useEffect } from 'react';

const { projectService } = window;

export const useOverrides = (deviceId: string) => {
  const [overrides, setOverrides] = useState<Map<string, MidiArray>>();

  useEffect(() => {
    const cb = (o: Map<string, MidiArray>) => {
      setOverrides(o);
    };

    const off = projectService.onOverridesChange(deviceId, cb);
    projectService.requestOverrides(deviceId);

    return () => off();
  }, [deviceId]);

  return { overrides };
};
