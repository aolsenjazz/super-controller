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

  const onColorChange = (s: number, color: Color) => {
    const bindings = { ...plugin.colorBindings };
    bindings[s] = color;
    applyChanges({ ...plugin, colorBindings: bindings });
  };

  const onFxChange = (s: number, fx: FxDriver) => {
    const bindings = { ...plugin.fxBindings };
    bindings[s] = fx;
    applyChanges({ ...plugin, fxBindings: bindings });
  };

  const onFxValueChange = (s: number, arr: MidiNumber[]) => {
    const bindings = { ...plugin.fxValueBindings };
    bindings[s] = arr;
    applyChanges({ ...plugin, fxValueBindings: bindings });
  };

  return (
    <div id="backlight-config">
      {availableStates.map((s: number) => {
        const color = colorBindings[s];
        const stateStr = s === 0 ? 'off' : 'on';

        return (
          <div key={s} className="color-config-container">
            <div>
              <h5>State: {stateStr}</h5>
            </div>
            <ColorSelect
              availableColors={availableColors}
              color={color}
              state={s}
              onChange={onColorChange}
            />
            {color?.effectable && (
              <FxSelect
                availableFx={availableFx}
                activeFx={fxBindings[s]}
                fxValueArr={fxValueBindings[s]}
                onFxChange={onFxChange}
                onFxValueChange={onFxValueChange}
                state={s}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
