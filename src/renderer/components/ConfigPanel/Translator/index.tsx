import { useState, useCallback } from 'react';

import { MidiArray } from '@shared/midi-array';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';
import { ConfigStub } from '@shared/hardware-config/device-config';

import RecentMessageRow from './RecentMessageRow';
import ControlsContainer from './ControlsContainer';
import OverrideRow from './OverrideRow';

const { projectService } = window;

type PropTypes = {
  config: ConfigStub;
};

export default function Translator(props: PropTypes) {
  const { config } = props;

  const [currentAction, setCurrentAction] = useState<MidiArray | undefined>();

  const onChange = useCallback(
    (
      statusString: StatusString,
      number: MidiNumber,
      channel: Channel,
      value: MidiNumber
    ) => {
      // if (currentAction !== undefined) {
      //   config.overrideInput(
      //     currentAction,
      //     statusString,
      //     channel,
      //     number,
      //     value
      //   );
      // }
    },
    [config, currentAction]
  );

  return (
    <div id="translator-pad-wrapper">
      <h3>MIDI Translator</h3>
      <div className="translator-list-container">
        <div className="column header row">
          <p className="column event">Event</p>
          <p className="column number">Number</p>
          <p className="column channel">Channel</p>
          <p className="column channel">Value</p>
        </div>
        <RecentMessageRow
          config={config}
          setCurrentAction={setCurrentAction}
          currentAction={currentAction}
        />
        {/*{Array.from(config.overrides).map(([overrideKey]) => (
          <OverrideRow
            currentAction={currentAction}
            setCurrentAction={setCurrentAction}
            overrideKey={overrideKey}
            key={overrideKey}
          />
        ))}*/}
      </div>
      {/* <ControlsContainer
        currentAction={currentAction}
        onChange={onChange}
        config={config}
        remove={() => {
          config.overrides.delete(JSON.stringify(currentAction));
          setProject(new Project(project.devices));
          projectService.updateDevice(stringify(config));
        }}
      />*/}
    </div>
  );
}
