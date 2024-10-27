import type { Color, FxDriver } from '../../../types';
import type { PluginUIProps } from '../../../core/plugin-ui-props';

import { BacklightControlDTO } from '..';
import BinaryColorSelect from './BinaryColorSelect';
import NStepColorSelect from './NStepColorSelect';

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
    outputResponse,
    eligibleOutputStrategies,
  } = plugin;

  const onColorChange = (s: number, color: Color) => {
    const newBindings = { ...plugin.colorBindings };
    newBindings[s] = color;

    const newState = {
      ...plugin,
      colorBindings: newBindings,
      fxBindings: { ...fxBindings },
      fxValueBindings: { ...fxValueBindings },
    };

    if (availableFx.length > 0 && color.effectable === true) {
      newState.fxBindings[s] = availableFx.find((f) => f.isDefault)!;
      newState.fxValueBindings[s] = availableFx.find(
        (f) => f.isDefault
      )!.defaultVal;
    } else {
      newState.fxBindings = {};
      newState.fxValueBindings = {};
    }

    applyChanges(newState);
  };

  const onFxChange = (s: number, fx: FxDriver) => {
    const bindings = { ...plugin.fxBindings };
    bindings[s] = fx;

    const newState = {
      ...plugin,
      fxBindings: bindings,
      fxValueBindings: { ...fxValueBindings },
    };
    newState.fxValueBindings[s] = fx.defaultVal;

    applyChanges(newState);
  };

  const onFxValueChange = (s: number, arr: MidiNumber[]) => {
    const bindings = { ...plugin.fxValueBindings };
    bindings[s] = arr;
    applyChanges({ ...plugin, fxValueBindings: bindings });
  };

  const onOutputStrategyClick = (strat: string) => {
    applyChanges({
      ...plugin,
      outputResponse: strat as BacklightControlDTO['outputResponse'],
    });
  };

  const onAdd = (state: number, color: Color) => {
    const newPlugin = {
      ...plugin,
      colorBindings: { ...colorBindings },
    };

    newPlugin.colorBindings[state] = color;

    applyChanges(newPlugin);
  };

  const onDelete = (state: number) => {
    const newPlugin = {
      ...plugin,
      colorBindings: { ...colorBindings },
      fxBindings: { ...fxBindings },
      fxValueBindings: { ...fxValueBindings },
    };

    delete newPlugin.colorBindings[state];
    delete newPlugin.fxBindings[state];
    delete newPlugin.fxValueBindings[state];

    applyChanges(newPlugin);
  };

  return (
    <div id="backlight-config">
      <label>
        Output Response:
        <select
          defaultValue={outputResponse}
          onChange={(e) => onOutputStrategyClick(e.target.value)}
        >
          {eligibleOutputStrategies.map((strat) => {
            return <option key={strat}>{strat}</option>;
          })}
        </select>
      </label>
      {outputResponse === 'n-step' ? (
        <NStepColorSelect
          availableColors={availableColors}
          availableFx={availableFx}
          colorBindings={colorBindings}
          fxBindings={fxBindings}
          fxValueBindings={fxValueBindings}
          onColorChange={onColorChange}
          onFxChange={onFxChange}
          onFxValueChange={onFxValueChange}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      ) : (
        <BinaryColorSelect
          availableColors={availableColors}
          availableFx={availableFx}
          availableStates={availableStates}
          colorBindings={colorBindings}
          fxBindings={fxBindings}
          fxValueBindings={fxValueBindings}
          onColorChange={onColorChange}
          onFxChange={onFxChange}
          onFxValueChange={onFxValueChange}
        />
      )}
    </div>
  );
}
