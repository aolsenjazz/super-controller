import type { Color } from '@shared/driver-types/color';
import type { FxDriver } from '@shared/driver-types/fx-driver';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { usePlugin } from '@hooks/use-plugin';

import { BacklightControlDTO } from '..';
import ColorSelect from './ColorSelect';
import FxSelect from './FxSelect';

import './BacklightControl.css';

const { BacklightControlService } = window;

export default function BacklightPluginUI(props: PluginUIProps) {
  const { pluginId } = props;
  const { plugin } = usePlugin<BacklightControlDTO>(pluginId);

  const {
    colorBindings,
    fxBindings,
    fxValueBindings,
    availableColors,
    availableFx,
    availableStates,
  } = plugin;

  const onColorChange = (state: number, color: Color) => {
    plugin.colorBindings[state] = color;
    BacklightControlService.updateColor(pluginId, state, color);
  };

  const onFxChange = (state: number, fx: FxDriver) => {
    plugin.fxBindings[state] = fx;
    BacklightControlService.updateFx(pluginId, state, fx);
  };

  const onFxValueChange = (state: number, arr: MidiNumber[]) => {
    plugin.fxValueBindings[state] = arr;
    BacklightControlService.updateFxValue(pluginId, state, arr);

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
