import { MidiArray, ThreeByteMidiArray } from '@shared/midi-array';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

import SettingsLineItem from '../SettingsLineItem';

type ControlsContainerPropTypes = {
  config: AnonymousDeviceConfig;
  currentAction: MidiArray | undefined;
  remove: () => void;
  onChange: (
    statusString: StatusString,
    number: MidiNumber,
    channel: Channel
  ) => void;
};

export default function ControlsContainer(props: ControlsContainerPropTypes) {
  const { currentAction, onChange, config, remove } = props;

  // if there is no selected source message, hide yaself
  if (currentAction === undefined) return null;

  const overrideOrUndefined = config.getOverride(currentAction);
  const msg = overrideOrUndefined || currentAction;

  const status = msg.statusString;
  const { channel } = msg as ThreeByteMidiArray;

  // prepare labels, selectable values, etc
  const eligibleEventTypes = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];
  const statusStringLabels = eligibleEventTypes;

  const eligibleNumbers = [...Array(128).keys()] as number[];
  const numberLabels = eligibleNumbers.map((n) => n.toString());

  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const channelLabels = eligibleChannels.map((c) => c.toString());

  return (
    <div id="controls-container">
      <h4>Apply the following overrides:</h4>
      <SettingsLineItem
        label="Event Type:"
        value={msg.statusString}
        valueList={eligibleEventTypes}
        labelList={statusStringLabels}
        onChange={(e) => {
          onChange(
            e as StatusString,
            (msg as ThreeByteMidiArray)[1],
            (msg as ThreeByteMidiArray).channel
          );
        }}
      />
      {status === 'pitchbend' ? null : (
        <SettingsLineItem
          label="Number:"
          value={msg[1]}
          valueList={eligibleNumbers}
          labelList={numberLabels}
          onChange={(n) => {
            onChange(
              msg.statusString as StatusString,
              n as MidiNumber,
              (msg as ThreeByteMidiArray).channel
            );
          }}
        />
      )}
      <SettingsLineItem
        label="Channel:"
        value={channel}
        labelList={channelLabels}
        valueList={eligibleChannels}
        onChange={(c) => {
          onChange(
            status as StatusString,
            (msg as ThreeByteMidiArray)[1],
            c as Channel
          );
        }}
      />
      {overrideOrUndefined ? (
        <button type="button" onClick={() => remove()}>
          Delete Override
        </button>
      ) : null}
    </div>
  );
}
