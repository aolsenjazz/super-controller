import type { Color } from '@shared/driver-types/color';
import type { FxDriver } from '@shared/driver-types/fx-driver';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import { BacklightControlDTO } from '..';
import ColorSelect from './ColorSelect';
import FxSelect from './FxSelect';

import './BacklightControl.css';

export default function BacklightPluginUI(
  props: PluginUIProps<BacklightControlDTO>
) {
  const { plugin, applyChanges } = props;

  const {
    colorBindings,
    fxBindings,
    fxValueBindings,
    availableColors,
    availableFx,
    availableStates,
  } = plugin;

  const onColorChange = (state: number, color: Color) => {
    const bindings = { ...plugin.colorBindings };
    bindings[state] = color;
    applyChanges({ ...plugin, colorBindings: bindings });
  };

  const onFxChange = (state: number, fx: FxDriver) => {
    const bindings = { ...plugin.fxBindings };
    bindings[state] = fx;
    applyChanges({ ...plugin, fxBindings: bindings });
  };

  const onFxValueChange = (state: number, arr: MidiNumber[]) => {
    const bindings = { ...plugin.fxValueBindings };
    bindings[state] = arr;
    applyChanges({ ...plugin, fxValueBindings: bindings });

    // Hackily apply fx, if necessary
  };

  return (
    <div id="backlight-config">
      {availableStates.map((state: number) => {
        const color = colorBindings[state];
        const stateStr = state === 0 ? 'off' : 'on';

        return (
          <div key={state} className="color-config-container">
            <div>
              <h5>State: {stateStr}</h5>
            </div>
            <ColorSelect
              availableColors={availableColors}
              color={color}
              state={state}
              onChange={onColorChange}
            />
            {color?.effectable && (
              <FxSelect
                availableFx={availableFx}
                activeFx={fxBindings[state]}
                fxValueArr={fxValueBindings[state]}
                onFxChange={onFxChange}
                onFxValueChange={onFxValueChange}
                state={state}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
