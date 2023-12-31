import { useCallback } from 'react';

import SettingsLineItem from '../../../SettingsLineItem';
import { BaseInputGroup } from '../../input-group/base-input-group';

const { projectService } = window;

type PropTypes = {
  group: BaseInputGroup;
  deviceId: string;
};

/**
 * TODO: in previous version, we made it clear in this list when a give number/channel
 * combination were in use by other inputs. I think this is a good design idea, but unclear how it fits
 * into the new design
 */
export default function NumberDropdown(props: PropTypes) {
  const { group, deviceId } = props;
  const { number, statusString } = group;

  const eligibleNumbers = [...Array(128).keys()] as MidiNumber[];
  const numberLabels = eligibleNumbers.map((v) => {
    if (statusString === 'controlchange') {
      // const inUseLabel = v === number ? '' : ' [in use]';
      return group.labelForNumber(v);
      // return config.bindingAvailable(statusString, v, channel as Channel) ||
      //   v === number
      //   ? group.labelForNumber(v)
      //   : `${v}${inUseLabel}`;
    }

    return group.labelForNumber(v);
  });

  const onChange = useCallback(
    (n: MidiNumber) => {
      group.inputs.forEach((i) => {
        i.number = n;
        projectService.updateInputs(deviceId, group.inputs);
      });
    },
    [group, deviceId]
  );

  return (
    <SettingsLineItem
      label="Number:"
      value={number}
      valueList={eligibleNumbers}
      labelList={numberLabels}
      onChange={onChange}
    />
  );
}
