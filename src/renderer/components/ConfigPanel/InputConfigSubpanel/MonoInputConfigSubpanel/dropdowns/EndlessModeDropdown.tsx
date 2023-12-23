import { useCallback } from 'react';

import HelpTip from '../../../../HelpTip';
import SettingsLineItem from '../../../SettingsLineItem';
import { KnobInputGroup } from '../../input-group/knob-input-group';

const { projectService } = window;

const helpTip = `When false, the values of endless knobs will be transformed to numbers between 0 and 127.`;

type PropTypes = {
  group: KnobInputGroup;
  deviceId: string;
};

export default function EndlessDropdown(props: PropTypes) {
  const { group, deviceId } = props;

  const endlessModeLabels = ['true', 'false'] as ('true' | 'false')[];

  const onChange = useCallback(
    (v: 'true' | 'false') => {
      group.inputs.forEach((i) => {
        i.valueType = v === 'true' ? 'endless' : 'absolute';
        projectService.updateInputs(deviceId, group.inputs);
      });
    },
    [group, deviceId]
  );

  return (
    <div id="absolute-values">
      <SettingsLineItem<'true' | 'false'>
        label="Endless mode:"
        value={group.isEndlessMode.toString()}
        valueList={endlessModeLabels}
        labelList={endlessModeLabels}
        onChange={onChange}
      />
      <HelpTip body={helpTip} transform="translate(-50%, -130%)" />
    </div>
  );
}
