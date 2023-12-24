import { useCallback } from 'react';

import SettingsLineItem from '../../../SettingsLineItem';
import { ColorCapableInputGroup } from '../../input-group/color-capable-input-group';

const { projectService } = window;

type PropTypes = {
  group: ColorCapableInputGroup;
  deviceId: string;
};

export default function LightResponseDropdown(props: PropTypes) {
  const { group, deviceId } = props;
  const { availableLightResponses } = group;

  const onChange = useCallback(
    (r: 'gate' | 'toggle') => {
      group.inputs.forEach((i) => {
        i.lightResponse = r;
        projectService.updateInputs(deviceId, group.inputs);
      });
    },
    [group, deviceId]
  );

  return (
    <SettingsLineItem
      label="Light Response"
      value={group.lightResponse}
      valueList={availableLightResponses}
      labelList={availableLightResponses}
      onChange={onChange}
    />
  );
}
