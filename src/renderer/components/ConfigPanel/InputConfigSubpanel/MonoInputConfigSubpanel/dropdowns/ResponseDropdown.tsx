import { InputResponse } from '@shared/driver-types';
import { useCallback } from 'react';

import SettingsLineItem from '../../../SettingsLineItem';
import { BaseInputGroup } from '../../input-group/base-input-group';

const { ConfigService } = window;

type PropTypes = {
  group: BaseInputGroup;
  deviceId: string;
};

export default function ResponseDropdown(props: PropTypes) {
  const { group, deviceId } = props;
  const { eligibleResponses, response } = group;
  const responseLabels = eligibleResponses.map((v) =>
    group.labelForResponse(v)
  );

  const onChange = useCallback(
    (or: InputResponse) => {
      group.inputs.forEach((i) => {
        i.outputResponse = or;
        ConfigService.updateInputs(deviceId, group.inputs);
      });
    },
    [group, deviceId]
  );

  return (
    <SettingsLineItem
      label="Output Response:"
      value={response}
      valueList={eligibleResponses}
      labelList={responseLabels}
      onChange={onChange}
    />
  );
}
