import { useState, useCallback } from 'react';
import {
  MidiMessage,
  MidiValue,
  EventType,
  Channel,
} from 'midi-message-parser';

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

export default function Forwarder(props: PropTypes) {
  const { config, project, setProject } = props;

  const [currentAction, setCurrentAction] = useState<MidiValue[] | null>(null);

  const onChange = useCallback(
    (
      eventType: EventType,
      number: MidiValue,
      channel: Channel,
      value: MidiValue
    ) => {
      const mm = new MidiMessage(eventType, number, value, channel, 0);

      config.overrides.set(JSON.stringify(currentAction), mm.toMidiArray());

      setProject(new Project(project.devices));
      scIpc.updateDevice(config.toJSON());
    },
    [project, config, setProject, currentAction]
  );

  return (
    <div id="forwarder-pad-wrapper">
      <h3>Message Forwarding</h3>
      <div className="forward-list-container">
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
