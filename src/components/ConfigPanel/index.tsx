import React, { useCallback } from 'react';
import { EventType, MidiValue, Channel } from 'midi-message-parser';

import SettingsLineItem from './SettingsLineItem';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import BacklightSettings from './BacklightSettings';
import DeviceConfigPanel from './DeviceConfigPanel';

import {
  DeviceConfig,
  SupportedDeviceConfig,
  InputConfig,
} from '../../hardware-config';
import { ipcRenderer } from '../../ipc-renderer';
import { Project } from '../../project';
import { InputGroup } from '../../input-group';

type InputConfigurationProps = {
  device: SupportedDeviceConfig;
  project: Project;
  group: InputGroup;
};

function InputConfiguration(props: InputConfigurationProps) {
  const { device, project, group } = props;

  const {
    number,
    channel,
    eventType,
    propagationStrategy,
    eligibleEventTypes,
    eligibleResponses,
  } = group;

  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const eligibleNumbers = [...Array(128).keys()] as MidiValue[];

  const numberLabels = eligibleNumbers.map((v) => {
    if (eventType === 'controlchange') {
      const inUseLabel = v === number ? '' : ' [in use]';
      return device.bindingAvailable(eventType, v, channel) || v === number
        ? group.labelForNumber(v)
        : `${v}${inUseLabel}`;
    }

    return group.labelForNumber(v);
  });
  const channelLabels = eligibleChannels.map((v) => group.labelForChannel(v));
  const eventTypeLabels = eligibleEventTypes.map((v) =>
    group.labelForEventType(v)
  );
  const responseLabels = eligibleResponses.map((v) =>
    group.labelForResponse(v)
  );

  const onChange = useCallback(
    (setter: (c: InputConfig) => void) => {
      group.inputs.forEach((i) => setter(i));

      ipcRenderer.sendProject(project, true);
    },
    [group, project]
  );

  const restoreDefaults = useCallback(() => {
    group.inputs.forEach((input) => input.restoreDefaults());
    ipcRenderer.sendProject(project, true);
  }, [group, project]);

  return (
    <>
      <DeviceConfigPanel project={project} config={device} />
      <h3>MIDI Settings</h3>
      <div id="controls-container">
        <SettingsLineItem
          label="Event Type:"
          value={eventType}
          valueList={eligibleEventTypes}
          labelList={eventTypeLabels}
          onChange={(v) =>
            onChange((c) => {
              c.eventType = v as EventType;
            })
          }
        />
        <SettingsLineItem
          label="Input Response:"
          value={propagationStrategy}
          valueList={eligibleResponses}
          labelList={responseLabels}
          onChange={(v) => {
            onChange((c) => {
              c.response = v as 'gate' | 'toggle' | 'linear';
            });
          }}
        />
        <SettingsLineItem
          label="Number:"
          value={number}
          valueList={eligibleNumbers}
          labelList={numberLabels}
          onChange={(v) => {
            onChange((c) => {
              c.number = v as MidiValue;
            });
          }}
        />
        <SettingsLineItem
          label="Channel:"
          value={channel}
          labelList={channelLabels}
          valueList={eligibleChannels}
          onChange={(v) => {
            onChange((c) => {
              c.channel = v as Channel;
            });
          }}
        />
        <button type="button" onClick={restoreDefaults}>
          Restore Defaults
        </button>
        <BacklightSettings group={group} project={project} device={device} />
      </div>
    </>
  );
}

type PropTypes = {
  device: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
};

export default function ConfigPanel(props: PropTypes) {
  const { selectedInputs, device, project } = props;
  /* eslint-disable-next-line */
  const isConfigured = project.getDevice(device?.id) ? true : false;
  const asSupported = device as SupportedDeviceConfig;

  const group = new InputGroup(
    selectedInputs.map((i) => asSupported?.getInput(i))
  );

  const element = (() => {
    if (device === null) return <BasicMessage msg="No connected devices." />;

    if (!device.supported) return <BasicMessage msg="" />;

    if (!isConfigured) return <NotConfigured config={asSupported} />;

    if (selectedInputs.length === 0)
      return (
        <>
          <DeviceConfigPanel project={project} config={asSupported} />
          <BasicMessage msg="No inputs selected." />
        </>
      );

    return (
      <>
        <InputConfiguration
          group={group}
          project={project}
          device={asSupported}
        />
      </>
    );
  })();

  return (
    <div id="config-panel" className="top-level">
      {element}
    </div>
  );
}
