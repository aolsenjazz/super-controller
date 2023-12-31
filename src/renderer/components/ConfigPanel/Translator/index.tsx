import { useState, useCallback } from 'react';

import { MidiArray } from '@shared/midi-array';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { useOverrides } from '@hooks/use-overrides';

import RecentMessageRow from './RecentMessageRow';
import ControlsContainer from './ControlsContainer';
import OverrideRow from './OverrideRow';

const { TranslatorService } = window;

type PropTypes = {
  config: ConfigStub;
};

export default function Translator(props: PropTypes) {
  const { config } = props;

  const [currentAction, setCurrentAction] = useState<MidiArray | undefined>();
  const { overrides } = useOverrides(config.id);

  const recentMessageOverridden = overrides?.get(JSON.stringify(currentAction));

  const onChange = useCallback(
    (
      statusString: StatusString,
      number: MidiNumber,
      channel: Channel,
      value: MidiNumber
    ) => {
      TranslatorService.addTranslatorOverride(
        config.id,
        currentAction!.array,
        statusString,
        channel,
        number,
        value
      );
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
        {!recentMessageOverridden && (
          <RecentMessageRow
            config={config}
            setCurrentAction={setCurrentAction}
            currentAction={currentAction}
          />
        )}
        {overrides &&
          Array.from(overrides).map(([overrideKey]) => (
            <OverrideRow
              currentAction={currentAction}
              setCurrentAction={setCurrentAction}
              overrideKey={overrideKey}
              key={overrideKey}
            />
          ))}
      </div>
      {currentAction && (
        <ControlsContainer
          currentAction={currentAction}
          onChange={onChange}
          config={config}
          remove={() => {
            TranslatorService.removeTranslatorOverride(
              config.id,
              currentAction!.array
            );
          }}
        />
      )}
    </div>
  );
}
