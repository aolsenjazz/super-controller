import { useCallback } from 'react';

import { ColorDescriptor, FxDriver } from '@shared/driver-types';

import { ColorCapableInputGroup } from '../input-group/color-capable-input-group';
import LightResponseDropdown from './dropdowns/LightResponseDropdown';
import ColorConfigRow from './ColorConfigRow';

const { ConfigService } = window;

type PropTypes = {
  group: ColorCapableInputGroup;
  deviceId: string;
};

export default function BacklightSettings(props: PropTypes) {
  const { group, deviceId } = props;

  const { availableLightStates, availableColors } = group;
  const isLightable = availableColors.length > 0;

  const onChange = useCallback(
    (
      state: number,
      color: ColorDescriptor,
      fx?: FxDriver,
      fxVal?: MidiNumber[]
    ) => {
      group.inputs.forEach((i) => {
        i.colorConfig.set(state, {
          color,
          fx,
          fxVal,
        });
      });

      ConfigService.updateInputs(deviceId, group.inputs);
    },
    [group, deviceId]
  );

  return (
    <>
      {isLightable ? (
        <>
          <h3>Backlight Settings</h3>
          <LightResponseDropdown group={group} deviceId={deviceId} />
          {availableLightStates.map((state: number) => {
            return (
              <ColorConfigRow
                key={state}
                color={group.colorForState(state)}
                availableColors={group.availableColors}
                availableFx={group.availableFx}
                state={state}
                fx={group.fxForState(state)}
                fxVal={group.fxValForState(state)}
                onChange={onChange}
              />
            );
          })}
        </>
      ) : null}
    </>
  );
}
