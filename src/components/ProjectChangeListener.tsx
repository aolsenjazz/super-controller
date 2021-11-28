import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { Project } from '../project';

import { MSG_CHANNEL, PROJECT_CHANNEL } from '../ipc-channels';

/**
 * Convenience function to wrap another function in a throttle. Useful to prevent
 * linear CC inputs from sending hundreds of messages per second, forcing a ridiculous
 * number of state updates.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle(func: (...args: any[]) => void, delay: number) {
  let timeout: NodeJS.Timeout | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (!timeout) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, func-names
      timeout = setTimeout(function (this: any) {
        func.call(this, ...args);
        timeout = null;
      }, delay);
    }
  };
}

function shouldThrottle(mm: MidiMessage) {
  return mm.type === 'controlchange' || mm.type === 'pitchbend';
}

type PropTypes = {
  project: Project;
  setProject: (project: Project) => void;
};

export default function ProjectChangeListener(props: PropTypes) {
  const { project, setProject } = props;

  /* When a new project is loaded in backend, update in frontend */
  useEffect(() => {
    const cb = (_e: Event, projString: string) => {
      const proj = Project.fromJSON(projString);
      setProject(proj);
    };

    ipcRenderer.on(PROJECT_CHANNEL, cb);
    return () => {
      ipcRenderer.removeListener(PROJECT_CHANNEL, cb);
    };
  });

  // When a new input signal is received from backend, process in our copy of
  // `Project` and update
  useEffect(() => {
    const throttledSetProject = throttle((p) => setProject(p), 100);

    const cb = (
      _e: Event,
      _inputId: string,
      deviceId: string,
      msg: MidiValue[]
    ) => {
      const device = project.getDevice(deviceId);
      if (device) device.handleMessage(msg);

      const newProj = new Project();
      newProj.devices = project.devices;

      // If the message received is a controlchange, throttle the setProject just
      // in case. React can't handle 100+ state updates per second.
      const mm = new MidiMessage(msg, 0);
      if (shouldThrottle(mm)) throttledSetProject(newProj);
      else setProject(newProj);
    };

    ipcRenderer.on(MSG_CHANNEL, cb);
    return () => {
      ipcRenderer.removeListener(MSG_CHANNEL, cb);
    };
  });

  return <></>;
}
