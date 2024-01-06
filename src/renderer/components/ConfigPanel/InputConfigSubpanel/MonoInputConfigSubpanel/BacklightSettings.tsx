import { useCallback } from 'react';

import { Color, ColorDescriptor, FxDriver } from '@shared/driver-types';

import { ColorCapableInputGroup } from '../input-group/color-capable-input-group';
import LightResponseDropdown from './dropdowns/LightResponseDropdown';
import ColorConfigRow from './ColorConfigRow';

const { ConfigService } = window;

/**
 * When a multiple inputs are selected with different colors set, we use this object to
 * set the "color hint", label, and hide FX.
 */
const mvc: Color = {
  name: '<multiple values>',
  string: 'transparent',
  array: [144, 0, 0],
  effectable: false,
};

/**
 * When a multiple inputs are selected with different FX's set, we use this object to
 * set the label
 */
const mvf: FxDriver = {
  title: '<multiple values>',
  effect: '',
  isDefault: true,
  validVals: [[0, 0, 0]],
  defaultVal: [0, 0, 0],
};

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
            const color =
              group.colorForState(state) === '<multiple values>'
                ? mvc
                : (group.colorForState(state) as Color | undefined);

            const fx =
              group.fxForState(state) === '<multiple values>'
                ? mvf
                : (group.fxForState(state) as FxDriver | undefined);

            return (
              <ColorConfigRow
                key={state}
                color={color}
                availableColors={group.availableColors}
                availableFx={group.availableFx}
                state={state}
                fx={fx}
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
