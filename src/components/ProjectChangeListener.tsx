import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { MidiValue } from 'midi-message-parser';

import { Project } from '../project';

import { MSG_CHANNEL, PROJECT_CHANNEL } from '../ipc-channels';

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
      setProject(newProj);
    };

    ipcRenderer.on(MSG_CHANNEL, cb);
    return () => {
      ipcRenderer.removeListener(MSG_CHANNEL, cb);
    };
  });

  return <></>;
}
