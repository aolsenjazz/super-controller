import type { Color } from '@shared/driver-types';
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
    BacklightControlService.updatePlugin(plugin);
  };

  return (
    <div>
      {availableStates.map((state: number) => {
        const color: Color = colorBindings[state];
        const stateStr = state === 0 ? 'off' : 'on';

        return (
          <div key={state} id="backlight-config">
            <div>
              <h5>State: {stateStr}</h5>
            </div>
            <ColorSelect
              availableColors={availableColors}
              color={color}
              state={state}
              onChange={onColorChange}
            />
            {/*{color?.effectable && (
              <FxSelect
                availableFx={availableFx}
                activeFx={fxBindings[state]}
                fxVal={fxValueBindings[state]}
                onFxChange={(value) => onFxChange(value, state)}
                onFxValChange={(value) => onFxValChange(value, state)}
              />
            )}*/}
            <div className="separator" />
          </div>
        );
      })}
    </div>
  );
}
