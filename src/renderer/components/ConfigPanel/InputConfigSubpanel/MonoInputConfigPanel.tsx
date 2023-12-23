import { useCallback } from 'react';

import {
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { KnobConfig } from '@shared/hardware-config/input-config';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';

import HelpTip from '../HelpTip';
import SettingsLineItem from './SettingsLineItem';
import BacklightSettings from './BacklightSettings';

import { InputGroup } from '../../input-group';

const { projectService } = window;

const absoluteHelpTip = `When false, the values of endless knobs will be transformed to numbers between 0 and 127.`;

type PropTypes = {
  group: InputGroup;
  title: string;
};

export default function MonoInputConfigPanel(props: PropTypes) {
  const { group, title } = props;

  const {
    number,
    channel,
    statusString,
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
    if (statusString === 'controlchange' && Number.isInteger(channel)) {
      const inUseLabel = v === number ? '' : ' [in use]';
      return config.bindingAvailable(statusString, v, channel as Channel) ||
        v === number
        ? group.labelForNumber(v)
        : `${v}${inUseLabel}`;
    }

    return group.labelForNumber(v);
  });
  const channelLabels = eligibleChannels.map((v) => group.labelForChannel(v));
  const statusStringLabels = eligibleEventTypes.map((v) =>
    group.labelForEventType(v)
  );
  const responseLabels = eligibleResponses.map((v) =>
    group.labelForResponse(v)
  );
  const endlessModeLabels = ['true', 'false'];

  const onChange = useCallback(
    (setter: (c: MonoInputConfig) => void) => {
      group.inputs.forEach((i) => {
        setter(i as MonoInputConfig); // TODO this smells
        projectService.updateInput(config.id, stringify(i));
      });

      setProject(new Project(project.devices));
    },
    [group, project, setProject, config]
  );

  const restoreDefaults = useCallback(() => {
    group.inputs.forEach((i) => {
      i.restoreDefaults();
      projectService.updateInput(config.id, stringify(i));
    });

    setProject(new Project(project.devices));
  }, [group, project, setProject, config]);

  return (
    <div>
      <h3>{title}</h3>
      <div id="controls-container">
        <SettingsLineItem
          label="Event Type:"
          value={statusString}
          valueList={eligibleEventTypes}
          labelList={statusStringLabels}
          onChange={(v) =>
            onChange((c) => {
              c.statusString = v as StatusString;
            })
          }
        />
        <SettingsLineItem
          label="Output Response:"
          value={response}
          valueList={eligibleResponses}
          labelList={responseLabels}
          onChange={(v) => {
            onChange((c) => {
              c.response = v as 'gate' | 'toggle' | 'continuous';
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
        {statusString === 'pitchbend' ? null : (
          <SettingsLineItem
            label="Number:"
            value={number}
            valueList={eligibleNumbers}
            labelList={numberLabels}
            onChange={(v) => {
              onChange((c) => {
                c.number = v as MidiNumber;
              });
            }}
          />
        )}
        {group.isEndlessCapable === true ? (
          <div id="absolute-values">
            <SettingsLineItem
              label="Endless mode:"
              value={group.isEndlessMode.toString()}
              valueList={endlessModeLabels}
              labelList={endlessModeLabels}
              onChange={(v) => {
                onChange((c) => {
                  (c as KnobConfig).valueType =
                    v === 'false' ? 'absolute' : 'endless';
                });
              }}
            />
            <HelpTip
              body={absoluteHelpTip}
              transform="translate(-50%, -130%)"
            />
          </div>
        ) : null}
        {group.isValueCapable ? (
          <SettingsLineItem
            label="Value:"
            value={value}
            valueList={eligibleValues}
            labelList={eligibleValues.map((v) => v.toString())}
            onChange={(v) => {
              onChange((c) => {
                c.value = v as MidiNumber;
              });
            }}
          />
        ) : null}
        <button type="button" onClick={restoreDefaults}>
          Restore Defaults
        </button>
        <BacklightSettings group={group} configId={config.id} />
      </div>
    </div>
  );
}
