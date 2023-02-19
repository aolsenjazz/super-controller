import { useEffect } from 'react';

import { create, MidiArray } from '@shared/midi-array';
import { applyDestructiveThrottle, parse } from '@shared/util';
import { Project } from '@shared/project';

const { hostService, projectService } = window;

function shouldThrottle(msg: MidiArray) {
  return msg.isCC || msg.isPitchBend;
}

type PropTypes = {
  project: Project;
  setProject: (project: Project) => void;
};

export default function ProjectChangeListener(props: PropTypes) {
  const { project, setProject } = props;

  /* When a new project is loaded in backend, update in frontend */
  useEffect(() => {
    const cb = (projString: string) => {
      const proj = parse<Project>(projString);
      setProject(proj);
    };
    const unsubscribe = projectService.onProjectChange(cb);
    return () => unsubscribe();
  });

  // When a new input signal is received from backend, process in our copy of
  // `Project` and update
  useEffect(() => {
    const throttledSetProject = applyDestructiveThrottle(
      (p) => setProject(p),
      100
    );

    const cb = (
      _inputId: string,
      deviceId: string,
      arr: NumberArrayWithStatus
    ) => {
      const msg = create(arr);
      const device = project.getDevice(deviceId);
      if (device) device.handleMessage(msg);

      const newProj = new Project();
      newProj.devices = project.devices;

      // If the message received is a controlchange, throttle the setProject just
      // in case. React can't handle 100+ state updates per second.
      if (shouldThrottle(msg)) throttledSetProject(newProj);
      else setProject(newProj);
    };

    const unsubscribe = hostService.onMessage(cb);
    return () => unsubscribe();
  });

  return <></>;
}
