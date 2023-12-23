import { useCallback } from 'react';

import { KnobConfigStub } from '@shared/hardware-config/input-config/knob-config';

// import BacklightSettings from './BacklightSettings';
import { BaseInputGroup } from '../input-group/base-input-group';

import StatusStringDropdown from './dropdowns/StatusStringDropdown';
import ResponseDropdown from './dropdowns/ResponseDropdown';
import ChannelDropdown from './dropdowns/ChannelDropdown';
import NumberDropdown from './dropdowns/NumberDropdown';
import ValueDropdown from './dropdowns/ValueDropdown';
import EndlessDropdown from './dropdowns/EndlessModeDropdown';
import { KnobInputGroup } from '../input-group/knob-input-group';

const { projectService } = window;

type PropTypes = {
  group: BaseInputGroup;
  title: string;
  deviceId: string;
};

export default function MonoInputConfigPanel(props: PropTypes) {
  const { group, title, deviceId } = props;

  const { statusString, type } = group;

  const restoreDefaults = useCallback(() => {
    group.inputs.forEach((i) => {
      i.statusString = i.defaults.statusString;
      i.channel = i.defaults.channel;
      i.outputResponse = i.defaults.response;
      i.number = i.defaults.number;

      if (i.type === 'knob') {
        const asKnob = i as KnobConfigStub;
        asKnob.valueType = asKnob.knobType;
      }
    });

    projectService.updateInputs(deviceId, group.inputs);
  }, [group, deviceId]);

  return (
    <div>
      <h3>{title}</h3>
      <div id="controls-container">
        <StatusStringDropdown group={group} deviceId={deviceId} />
        <ResponseDropdown group={group} deviceId={deviceId} />
        <ChannelDropdown group={group} deviceId={deviceId} />
        {statusString === 'pitchbend' && (
          <NumberDropdown group={group} deviceId={deviceId} />
        )}
        {type === 'knob' &&
          (group as KnobInputGroup).isEndlessCapable === true && (
            <EndlessDropdown
              group={group as KnobInputGroup}
              deviceId={deviceId}
            />
          )}
        {group.isValueCapable && (
          <ValueDropdown group={group} deviceId={deviceId} />
        )}
        <button type="button" onClick={restoreDefaults}>
          Restore Defaults
        </button>
        {/*<BacklightSettings group={group} />*/}
      </div>
    </div>
  );
}
