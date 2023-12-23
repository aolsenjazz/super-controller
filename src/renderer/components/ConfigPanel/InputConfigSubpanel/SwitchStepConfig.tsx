/* eslint-disable no-bitwise */
import { useCallback } from 'react';

import { stringify, CC_BINDINGS, NOTE_BINDINGS } from '@shared/util';
import { byteToStatusString, statusStringToByte } from '@shared/midi-util';
import { Project } from '@shared/project';
import { SwitchConfig } from '@shared/hardware-config';
import { NonsequentialStepPropagator } from '@shared/propagators';
import { create, MidiArray } from '@shared/midi-array';

import SettingsLineItem from '../SettingsLineItem';

const { projectService } = window;

type PropTypes = {
  defaultMsg: NumberArrayWithStatus;
  msg: MidiArray;
  project: Project;
  config: SwitchConfig;
  deviceId: string;
  setProject: (p: Project) => void;
};

export default function MonoInputConfigPanel(props: PropTypes) {
  const { defaultMsg, msg, project, config, setProject, deviceId } = props;

  const statusString = byteToStatusString((msg[0] & 0xf0) as StatusByte, true);
  const channel = msg[0] & 0x0f;
  const number = msg[1];
  const value = msg.length === 3 ? msg[2] : 0;

  const eligibleStatusStrings = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];
  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const eligibleNumbers = [...Array(128).keys()] as number[];
  const eligibleValues = [...Array(128).keys()] as number[];

  const statusLabels = eligibleStatusStrings.map((s) => {
    const defStatus = byteToStatusString((defaultMsg[0] & 0xf0) as StatusByte);
    return `${s} ${s === defStatus ? '[default]' : ''}`;
  });

  const channelLabels = eligibleChannels.map((c) => {
    return `${c} ${c === (defaultMsg[0] & 0x0f) ? '[default]' : ''}`;
  });

  const valueLabels = eligibleValues.map((v) => {
    return msg.length === 2
      ? `${v} ${v === defaultMsg[2] ? '[default]' : ''}`
      : `${v}`;
  });

  // get labels for all eligible values
  const numberLabels = eligibleNumbers.map((v) => {
    const isDefault = defaultMsg[1] === v;

    if (['noteon', 'noteoff'].includes(statusString)) {
      return `${v} ${isDefault ? '[default]' : NOTE_BINDINGS.get(v)}`;
    }

    return statusString === 'controlchange'
      ? `${v} ${isDefault ? '' : CC_BINDINGS.get(v)} ${
          isDefault ? '[default]' : ''
        }`
      : `${v} ${isDefault ? '[default]' : ''}`;
  });

  const onChange = useCallback(
    (m: NumberArrayWithStatus) => {
      const prop = config.outputPropagator as NonsequentialStepPropagator;
      prop.setStep(defaultMsg, create(m));
      projectService.updateInput(deviceId, stringify(config));
      setProject(new Project(project.devices));
    },
    [setProject, project, defaultMsg, config, deviceId]
  );

  return (
    <div>
      <div id="controls-container">
        <SettingsLineItem
          label="Event Type:"
          value={statusString}
          valueList={eligibleStatusStrings}
          labelList={statusLabels}
          onChange={(v) => {
            const newByte = statusStringToByte(v as StatusString);
            const newArr = JSON.parse(JSON.stringify(msg.array));
            newArr[0] = newByte | (newArr[0] & 0x0f);
            onChange(newArr);
          }}
        />
        <SettingsLineItem
          label="Channel:"
          value={channel}
          labelList={channelLabels}
          valueList={eligibleChannels}
          onChange={(c) => {
            const newArr = JSON.parse(JSON.stringify(msg.array));
            newArr[0] = (c as Channel) | (newArr[0] & 0xf0);
            onChange(newArr);
          }}
        />
        <SettingsLineItem
          label="Number:"
          value={number}
          valueList={eligibleNumbers}
          labelList={numberLabels}
          onChange={(v) => {
            const newArr = JSON.parse(JSON.stringify(msg.array));
            newArr[1] = v as MidiNumber;
            onChange(newArr);
          }}
        />
        {statusString !== 'programchange' ? (
          <SettingsLineItem
            label="Value:"
            value={value}
            valueList={eligibleValues}
            labelList={valueLabels}
            onChange={(v) => {
              const newArr = JSON.parse(JSON.stringify(msg.array));
              newArr[2] = v as MidiNumber;
              onChange(newArr);
            }}
          />
        ) : null}
        <button type="button" onClick={() => onChange(defaultMsg)}>
          Restore Defaults
        </button>
      </div>
    </div>
  );
}
