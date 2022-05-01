import { useState, useCallback } from 'react';

import { Channel, StatusString, setStatus } from '@shared/midi-util';
import { Project } from '@shared/project';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

import RecentMessageRow from './RecentMessageRow';
import ControlsContainer from './ControlsContainer';
import OverrideRow from './OverrideRow';

const scIpc = window.ipcRenderer;

type PropTypes = {
  config: AnonymousDeviceConfig;
  project: Project;
  setProject: (p: Project) => void;
};

export default function Translator(props: PropTypes) {
  const { config, project, setProject } = props;

  const [currentAction, setCurrentAction] = useState<number[] | null>(null);

  const onChange = useCallback(
    (
      eventType: StatusString,
      number: number,
      channel: Channel,
      value: number
    ) => {
      const msg = setStatus([channel, number, value], eventType);

      config.overrides.set(JSON.stringify(currentAction), msg);

      setProject(new Project(project.devices));
      scIpc.updateDevice(config.toJSON());
    },
    [project, config, setProject, currentAction]
  );

  return (
    <div id="translator-pad-wrapper">
      <h3>MIDI Translator</h3>
      <div className="translator-list-container">
        <div className="column header row">
          <p className="column event">Event</p>
          <p className="column number">Number</p>
          <p className="column channel">Channel</p>
        </div>
        <RecentMessageRow
          config={config}
          setCurrentAction={setCurrentAction}
          currentAction={currentAction}
        />
        {Array.from(config.overrides).map(([overrideKey]) => (
          <OverrideRow
            currentAction={currentAction}
            setCurrentAction={setCurrentAction}
            overrideKey={overrideKey}
            key={overrideKey}
          />
        ))}
      </div>
      <ControlsContainer
        currentAction={currentAction}
        onChange={onChange}
        config={config}
        remove={() => {
          config.overrides.delete(JSON.stringify(currentAction));
          setProject(new Project(project.devices));
          scIpc.updateDevice(config.toJSON());
        }}
      />
    </div>
  );
}
