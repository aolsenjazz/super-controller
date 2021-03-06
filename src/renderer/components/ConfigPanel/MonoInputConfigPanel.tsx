import { useCallback } from 'react';
import { Channel, StatusString } from '@shared/midi-util';

import { InputConfig, SupportedDeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';

import SettingsLineItem from './SettingsLineItem';
import BacklightSettings from './BacklightSettings';

import { InputGroup } from '../../input-group';

const { ipcRenderer } = window;

type PropTypes = {
  group: InputGroup;
  project: Project;
  config: SupportedDeviceConfig;
  title: string;
  setProject: (p: Project) => void;
};

/**
 * Configuration controls for individual inputs
 *
 * @param props Component props
 * @param props.inputGroup Input group for selected inputs
 * @param props.project Current project
 * @param props.config Current device's configuration
 * @param props.setProject updates the project in the frontend
 * @param props.title Title of the input configuration panel
 */
export default function MonoInputConfigPanel(props: PropTypes) {
  const { group, config, project, title, setProject } = props;

  const {
    number,
    channel,
    eventType,
    response,
    value,
    eligibleEventTypes,
    eligibleResponses,
  } = group;

  // get all eligible values the given input group can be
  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const eligibleNumbers = [...Array(128).keys()] as number[];
  const eligibleValues = [...Array(128).keys()] as number[];

  // get labels for all eligible values
  const numberLabels = eligibleNumbers.map((v) => {
    if (eventType === 'controlchange' && Number.isInteger(channel)) {
      const inUseLabel = v === number ? '' : ' [in use]';
      return config.bindingAvailable(eventType, v, channel as Channel) ||
        v === number
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
      group.inputs.forEach((i) => {
        setter(i);
        ipcRenderer.updateInput(config.id, i.toJSON(true));
      });

      setProject(new Project(project.devices));
    },
    [group, project, setProject, config]
  );

  const restoreDefaults = useCallback(() => {
    group.inputs.forEach((i) => {
      i.restoreDefaults();
      ipcRenderer.updateInput(config.id, i.toJSON(true));
    });

    setProject(new Project(project.devices));
  }, [group, project, setProject, config]);

  return (
    <>
      <h3>{title}</h3>
      <div id="controls-container">
        <SettingsLineItem
          label="Event Type:"
          value={eventType}
          valueList={eligibleEventTypes}
          labelList={eventTypeLabels}
          onChange={(v) =>
            onChange((c) => {
              c.eventType = v as StatusString;
            })
          }
        />
        <SettingsLineItem
          label="Input Response:"
          value={response}
          valueList={eligibleResponses}
          labelList={responseLabels}
          onChange={(v) => {
            onChange((c) => {
              c.response = v as 'gate' | 'toggle' | 'continuous';
            });
          }}
        />
        {eventType !== 'programchange' && response === 'constant' ? (
          <SettingsLineItem
            label="Value:"
            value={value}
            valueList={eligibleValues}
            labelList={eligibleValues.map((v) => v.toString())}
            onChange={(v) => {
              onChange((c) => {
                c.value = v as number;
              });
            }}
          />
        ) : null}
        {eventType === 'pitchbend' ? null : (
          <SettingsLineItem
            label="Number:"
            value={number}
            valueList={eligibleNumbers}
            labelList={numberLabels}
            onChange={(v) => {
              onChange((c) => {
                c.number = v as number;
              });
            }}
          />
        )}
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
        <BacklightSettings
          group={group}
          project={project}
          setProject={setProject}
          configId={config.id}
        />
      </div>
    </>
  );
}
