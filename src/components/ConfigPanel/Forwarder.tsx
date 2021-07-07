import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import {
  MidiMessage,
  MidiValue,
  EventType,
  Channel,
} from 'midi-message-parser';

import SettingsLineItem from './SettingsLineItem';

import { Project } from '../../Project';
import { ipcRenderer as scIpc } from '../../ipc-renderer';
import { AnonymousDeviceConfig } from '../../hardware-config';
import { inputIdFor, inputIdToMidiMessage } from '../../device-util';

type ControlsContainerPropTypes = {
  inputId: string | null;
  config: AnonymousDeviceConfig;
  remove: (id: string) => void;
  onChange: (
    id: string,
    eventType: EventType,
    number: MidiValue,
    channel: Channel,
    value: MidiValue
  ) => void;
};

function ControlsContainer(props: ControlsContainerPropTypes) {
  const { inputId, onChange, config, remove } = props;

  if (inputId === null) return null;

  const overrideOrUndefined = config.overrides.get(inputId);
  const msg = overrideOrUndefined
    ? new MidiMessage(overrideOrUndefined, 0)
    : inputIdToMidiMessage(inputId);

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
        value={msg.type}
        valueList={eligibleEventTypes}
        labelList={eventTypeLabels}
        onChange={(e) => {
          onChange(
            inputId,
            e as EventType,
            msg.number,
            msg.channel,
            e === 'noteon' ? 127 : 0
          );
        }}
      />
      {msg.type === 'pitchbend' ? null : (
        <SettingsLineItem
          label="Number:"
          value={msg.number}
          valueList={eligibleNumbers}
          labelList={numberLabels}
          onChange={(n) => {
            onChange(
              inputId,
              msg.type as EventType,
              n as MidiValue,
              msg.channel,
              msg.value as MidiValue
            );
          }}
        />
      )}
      {msg.type === 'noteoff' || msg.type === 'programchange' ? null : (
        <SettingsLineItem
          label="Value:"
          value={msg.value}
          valueList={eligibleValues}
          labelList={valueLabels}
          onChange={(v) => {
            onChange(
              inputId,
              msg.type as EventType,
              msg.number as MidiValue,
              msg.channel,
              v as MidiValue
            );
          }}
        />
      )}
      <SettingsLineItem
        label="Channel:"
        value={msg.channel}
        labelList={channelLabels}
        valueList={eligibleChannels}
        onChange={(c) => {
          onChange(
            inputId,
            msg.type as EventType,
            msg.number,
            c as Channel,
            msg.value as MidiValue
          );
        }}
      />
      <button
        type="button"
        onClick={() => {
          remove(inputId);
        }}
      >
        Delete Override
      </button>
    </div>
  );
}

type RecentMessageRowPropTypes = {
  config: AnonymousDeviceConfig;
  onClick: (id: string) => void;
  selectedId: string | null;
};

function RecentMessageRow(props: RecentMessageRowPropTypes) {
  const { config, onClick, selectedId } = props;

  const [recentMessage, setRecentMessage] = useState<MidiMessage | null>(null);
  const selected = recentMessage && selectedId === inputIdFor(recentMessage);

  useEffect(() => {
    const cb = (_e: Event, msg: MidiValue[]) => {
      const mm = new MidiMessage(msg, 0);
      const newId = inputIdFor(mm);
      setRecentMessage(mm);
      if (newId !== selectedId) onClick(newId);
    };

    ipcRenderer.on(config.id, cb);

    return () => {
      ipcRenderer.removeListener(config.id, cb);
    };
  }, [config, selectedId, onClick, selected]);

  if (recentMessage === null || config.overrides.get(inputIdFor(recentMessage)))
    return null;

  return (
    <div
      className={`row recent ${selected ? 'selected' : ''}`}
      onClick={() => onClick(inputIdFor(recentMessage))}
      onKeyDown={() => {}}
      tabIndex={0}
      role="button"
    >
      <p className="column event">{recentMessage.type}</p>
      <p className="column number">{recentMessage.number}</p>
      <p className="column channel">{recentMessage.channel}</p>
    </div>
  );
}

type PropTypes = {
  config: AnonymousDeviceConfig;
  project: Project;
};

export default function Forwarder(props: PropTypes) {
  const { config, project } = props;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onClick = useCallback(
    (id) => {
      if (selectedId === id) setSelectedId(null);
      else setSelectedId(id);
    },
    [selectedId]
  );

  const onChange = useCallback(
    (
      id: string,
      eventType: EventType,
      number: MidiValue,
      channel: Channel,
      value: MidiValue
    ) => {
      const mm = new MidiMessage(eventType, number, value, channel, 0);
      config.overrides.set(id, mm.toMidiArray());
      scIpc.sendProject(project, true);
    },
    [project, config]
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
        {Array.from(config.overrides).map(([k]) => {
          const mm = inputIdToMidiMessage(k);
          const selected = selectedId === inputIdFor(mm);
          return (
            <div
              className={`column header row ${selected ? 'selected' : ''}`}
              key={k}
              onClick={() => setSelectedId(k)}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              <p className="column event">{mm.type}</p>
              <p className="column number">{mm.number}</p>
              <p className="column channel">{mm.channel}</p>
            </div>
          );
        })}
        <RecentMessageRow
          config={config}
          onClick={onClick}
          selectedId={selectedId}
        />
      </div>
      <ControlsContainer
        inputId={selectedId}
        onChange={onChange}
        config={config}
        remove={(id) => {
          config.overrides.delete(id);
          scIpc.sendProject(project, true);
        }}
      />
    </div>
  );
}
