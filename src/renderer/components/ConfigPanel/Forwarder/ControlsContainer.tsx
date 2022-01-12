import {
  StatusString,
  Channel,
  getStatus,
  getChannel,
} from '@shared/midi-util';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

import SettingsLineItem from '../SettingsLineItem';

type ControlsContainerPropTypes = {
  config: AnonymousDeviceConfig;
  currentAction: number[] | null;
  remove: () => void;
  onChange: (
    eventType: StatusString,
    number: number,
    channel: Channel,
    value: number
  ) => void;
};

export default function ControlsContainer(props: ControlsContainerPropTypes) {
  const { currentAction, onChange, config, remove } = props;

  // if there is no selected source message, hide yaself
  if (currentAction === null) return null;

  const overrideOrUndefined = config.overrides.get(
    JSON.stringify(currentAction)
  );
  const msg = overrideOrUndefined || currentAction;
  const status = getStatus(msg).string;
  const channel = getChannel(msg);

  // prepare labels, selectable values, etc
  const eligibleEventTypes = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];
  const eventTypeLabels = eligibleEventTypes;

  const eligibleNumbers = [...Array(128).keys()] as number[];
  const numberLabels = eligibleNumbers.map((n) => n.toString());

  const eligibleValues = [...Array(128).keys()] as number[];
  const valueLabels = eligibleNumbers.map((n) => n.toString());

  const eligibleChannels = [...Array(16).keys()] as Channel[];
  const channelLabels = eligibleChannels.map((c) => c.toString());

  return (
    <div id="controls-container">
      <h4>Apply the following overrides:</h4>
      <SettingsLineItem
        label="Event Type:"
        value={getStatus(msg).string}
        valueList={eligibleEventTypes}
        labelList={eventTypeLabels}
        onChange={(e) => {
          onChange(
            e as StatusString,
            msg[1],
            getChannel(msg),
            e === 'noteon' ? 127 : 0
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
              getStatus(msg).string,
              n as number,
              getChannel(msg),
              msg[2]
            );
          }}
        />
      )}
      {['noteoff', 'programchange'].includes(status) ? null : (
        <SettingsLineItem
          label="Value:"
          value={msg[2]}
          valueList={eligibleValues}
          labelList={valueLabels}
          onChange={(v) => {
            onChange(status, msg[1], channel, v as number);
          }}
        />
      )}
      <SettingsLineItem
        label="Channel:"
        value={channel}
        labelList={channelLabels}
        valueList={eligibleChannels}
        onChange={(c) => {
          onChange(status, msg[1], c as Channel, msg[2]);
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
