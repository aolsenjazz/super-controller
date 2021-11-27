import React from 'react';
import {
  MidiMessage,
  MidiValue,
  EventType,
  Channel,
} from 'midi-message-parser';

import SettingsLineItem from '../SettingsLineItem';

import { AnonymousDeviceConfig } from '../../../hardware-config';

type ControlsContainerPropTypes = {
  config: AnonymousDeviceConfig;
  currentAction: MidiValue[] | null;
  remove: () => void;
  onChange: (
    eventType: EventType,
    number: MidiValue,
    channel: Channel,
    value: MidiValue
  ) => void;
};

export default function ControlsContainer(props: ControlsContainerPropTypes) {
  const { currentAction, onChange, config, remove } = props;

  // if there is no selected source message, hide yaself
  if (currentAction === null) return null;

  const overrideOrUndefined = config.overrides.get(
    JSON.stringify(currentAction)
  );
  const msgToDisplay = overrideOrUndefined || currentAction;
  const mm = new MidiMessage(msgToDisplay, 0);

  // prepare labels, selectable values, etc
  const eligibleEventTypes = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];
  const eventTypeLabels = eligibleEventTypes;

  const eligibleNumbers = [...Array(128).keys()] as MidiValue[];
  const numberLabels = eligibleNumbers.map((n) => n.toString());

  const eligibleValues = [...Array(128).keys()] as MidiValue[];
  const valueLabels = eligibleNumbers.map((n) => n.toString());

  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const channelLabels = eligibleChannels.map((c) => c.toString());

  return (
    <div id="controls-container">
      <h4>Apply the following overrides:</h4>
      <SettingsLineItem
        label="Event Type:"
        value={mm.type}
        valueList={eligibleEventTypes}
        labelList={eventTypeLabels}
        onChange={(e) => {
          onChange(
            e as EventType,
            mm.number,
            mm.channel,
            e === 'noteon' ? 127 : 0
          );
        }}
      />
      {mm.type === 'pitchbend' ? null : (
        <SettingsLineItem
          label="Number:"
          value={mm.number}
          valueList={eligibleNumbers}
          labelList={numberLabels}
          onChange={(n) => {
            onChange(
              mm.type as EventType,
              n as MidiValue,
              mm.channel,
              mm.value as MidiValue
            );
          }}
        />
      )}
      {mm.type === 'noteoff' || mm.type === 'programchange' ? null : (
        <SettingsLineItem
          label="Value:"
          value={mm.value}
          valueList={eligibleValues}
          labelList={valueLabels}
          onChange={(v) => {
            onChange(
              mm.type as EventType,
              mm.number as MidiValue,
              mm.channel,
              v as MidiValue
            );
          }}
        />
      )}
      <SettingsLineItem
        label="Channel:"
        value={mm.channel}
        labelList={channelLabels}
        valueList={eligibleChannels}
        onChange={(c) => {
          onChange(
            mm.type as EventType,
            mm.number,
            c as Channel,
            mm.value as MidiValue
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
