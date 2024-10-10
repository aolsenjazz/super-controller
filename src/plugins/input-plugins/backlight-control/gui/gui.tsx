import type { Color } from '@shared/driver-types/color';
import type { FxDriver } from '@shared/driver-types/fx-driver';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { useAppDispatch } from '@hooks/use-app-dispatch';
import { sumMidiArrays } from '@shared/util';

import { BacklightControlDTO } from '..';
import ColorSelect from './ColorSelect';
import FxSelect from './FxSelect';

import './BacklightControl.css';

export default function BacklightPluginUI(
  props: PluginUIProps<BacklightControlDTO>
) {
  const { plugin, applyChanges } = props;

  // Generally, plugins should not dispatching redux events. Please don't do this
  const dispatch = useAppDispatch();

  const {
    colorBindings,
    fxBindings,
    fxValueBindings,
    availableColors,
    availableFx,
    availableStates,
    state,
  } = plugin;

  const updateDeviceRender = (
    newColorBindings: typeof plugin['colorBindings'],
    newFxValBindings: typeof plugin['fxValueBindings']
  ) => {
    // construct message to send
    const colorMsg = newColorBindings[state].array;
    const fxMsg = newFxValBindings[state];
    const message = fxMsg ? sumMidiArrays(colorMsg, fxMsg) : colorMsg;

    // update the device render
    dispatch({
      type: 'recentLoopbackMessages/addMessage',
      payload: {
        deviceId: plugin.parentId.split('::')[0],
        inputId: plugin.parentId.split('::')[1],
        message,
      },
    });
  };

  const onColorChange = (s: number, color: Color) => {
    const bindings = { ...plugin.colorBindings };
    bindings[s] = color;
    applyChanges({ ...plugin, colorBindings: bindings });
    updateDeviceRender(bindings, fxValueBindings);
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
    updateDeviceRender(colorBindings, bindings);
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
