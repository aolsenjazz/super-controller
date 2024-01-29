import { create, MidiArray, ThreeByteMidiArray } from '@shared/midi-array';
import { DeviceConfigStub } from '@shared/hardware-config/device-config';

import SettingsLineItem from '../SettingsLineItem';

const { TranslatorService } = window;

type ControlsContainerPropTypes = {
  config: DeviceConfigStub;
  currentAction: MidiArray;
  remove: () => void;
  onChange: (
    statusString: StatusString,
    number: MidiNumber,
    channel: Channel,
    value: MidiNumber
  ) => void;
};

export default function ControlsContainer(props: ControlsContainerPropTypes) {
  const { currentAction, onChange, config, remove } = props;

  // if there is no selected source message, hide yaself
  if (currentAction === undefined) return null;

  const overrideOrUndefined = TranslatorService.getTranslatorOverride(
    config.id,
    currentAction
  );
  const arr = overrideOrUndefined || currentAction;
  const msg = create(arr);

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

  const eligibleValues = [...Array(128).keys()] as MidiNumber[];
  const valueLabels = eligibleValues.map((v) => v.toString());

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
            (msg as ThreeByteMidiArray).channel,
            (msg.length === 3 ? msg[2] : 0) as MidiNumber
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
              (msg as ThreeByteMidiArray).channel,
              (msg.length === 3 ? msg[2] : 0) as MidiNumber
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
            c as Channel,
            (msg.length === 3 ? msg[2] : 0) as MidiNumber
          );
        }}
      />
      {msg.length === 3 ? (
        <SettingsLineItem
          label="Value:"
          value={msg[2]}
          labelList={valueLabels}
          valueList={eligibleValues}
          onChange={(v) => {
            onChange(
              status as StatusString,
              (msg as ThreeByteMidiArray)[1],
              (msg as ThreeByteMidiArray).channel,
              v as MidiNumber
            );
          }}
        />
      ) : null}

      {overrideOrUndefined ? (
        <button type="button" onClick={() => remove()}>
          Delete Override
        </button>
      ) : null}
    </div>
  );
}
