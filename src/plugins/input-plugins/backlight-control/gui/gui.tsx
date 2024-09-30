import { useCallback } from 'react';

import type { FxDriver } from '@shared/driver-types';
import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';
import { usePlugin } from '@hooks/use-plugin';
import { colorDisplayName } from '@shared/util';

// Since we want the UI to be self-contained, we'll include the implementations of these components directly
// import BasicSelect from './BasicSelect';
// import FXConfig from './FXConfig';
// import SettingsLineItem from './SettingsLineItem';

// Import the plugin DTO
import { BacklightControlDTO } from '..';

// BasicSelect Component
type BasicSelectProps<T extends string | number> = {
  valueList: T[];
  labelList: string[];
  value: T;
  placeholder?: string;
  onChange: (value: T) => void;
};

type FXConfigProps = {
  availableFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxVal: MidiNumber[] | undefined | '<multiple values>';
  onFxChange: (id: string) => void;
  onFxValChange: (val: MidiNumber[]) => void;
};

function FXConfig(props: FXConfigProps) {
  const { availableFx, activeFx, onFxChange, onFxValChange, fxVal } = props;

  const innerFxChange = useCallback(
    (v: string | number) => {
      onFxChange(v as string);
    },
    [onFxChange]
  );

  const innerFxValChange = useCallback(
    (v: number) => {
      if (activeFx) {
        onFxValChange(activeFx.validVals[v]);
      }
    },
    [onFxValChange, activeFx]
  );

  const valueList = availableFx.map((fx) => fx.id);
  const labelList = availableFx.map((fx) => fx.title);

  let SliderOrNull = null;
  if (
    activeFx &&
    activeFx.id !== '<multiple values>' &&
    fxVal &&
    fxVal !== '<multiple values>'
  ) {
    let defaultVal = 0;
    activeFx.validVals.forEach((arr, i) => {
      if (JSON.stringify(arr) === JSON.stringify(fxVal)) {
        defaultVal = i;
      }
    });

    SliderOrNull = (
      <div className="slider-container">
        <label>{activeFx.lowBoundLabel}</label>
        <input
          type="range"
          min="0"
          max={activeFx.validVals.length - 1}
          value={defaultVal}
          onChange={(e) => innerFxValChange(parseInt(e.target.value, 10))}
        />
        <label>{activeFx.highBoundLabel}</label>
      </div>
    );
  }

  return (
    <div className="settings-line fx-setting">
      <p>FX:</p>
      <BasicSelect
        value={activeFx?.id || ''}
        valueList={valueList}
        labelList={labelList}
        onChange={innerFxChange}
      />
      {SliderOrNull}
    </div>
  );
}

function BasicSelect<T extends string | number>(props: BasicSelectProps<T>) {
  const { valueList, value, onChange, labelList, placeholder } = props;
  const isMultiple = value === '<multiple values>';

  return (
    <div className="basic-select">
      <select
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          const isNum = /^\d+$/.test(newValue);
          const v = isNum
            ? (parseInt(newValue, 10) as unknown as T)
            : (newValue as T);
          onChange(v);
        }}
      >
        {placeholder !== undefined ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {isMultiple ? (
          <option value="<multiple values>" disabled>
            &#60;Multiple Values&#62;
          </option>
        ) : null}
        {valueList.map((v, i) => (
          <option value={v} key={v}>
            {labelList[i]}
          </option>
        ))}
      </select>
    </div>
  );
}

BasicSelect.defaultProps = {
  placeholder: undefined,
};

// Begin BacklightPluginUI Component
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

  const onColorChange = useCallback(
    (colorId: string, state: number) => {
      const color = availableColors.find(
        (c) => colorDisplayName(c) === colorId
      );
      if (color) {
        plugin.colorBindings[state] = color;
        // Optionally, trigger an update or save
      }
    },
    [plugin, availableColors]
  );

  const onFxChange = useCallback(
    (fxId: string, state: number) => {
      const fx = availableFx?.find((f) => f.id === fxId);
      if (fx) {
        plugin.fxBindings[state] = fx;
        // Optionally, trigger an update or save
      }
    },
    [plugin, availableFx]
  );

  const onFxValChange = useCallback(
    (fxVal: MidiNumber[], state: number) => {
      plugin.fxValueBindings[state] = fxVal;
      // Optionally, trigger an update or save
    },
    [plugin]
  );

  return (
    <>
      {/* Uncomment if you have the LightResponse component */}
      {/* <LightResponse plugin={plugin} /> */}

      {availableStates.map((state: number) => {
        const color = colorBindings[state];
        const stateStr = state === 0 ? 'off' : 'on';

        return (
          <div key={state} id="backlight-config">
            <div className="settings-line color-setting">
              <h5>State: {stateStr}</h5>
            </div>
            <div className="settings-line color-setting">
              <p>Color:</p>
              <div
                className="color-sample"
                style={{ backgroundColor: color?.string || '' }}
              />
              <BasicSelect
                value={color ? colorDisplayName(color) : ''}
                valueList={availableColors.map(colorDisplayName)}
                labelList={availableColors.map(colorDisplayName)}
                onChange={(value) => onColorChange(value as string, state)}
              />
            </div>
            {availableFx?.length > 0 && color?.effectable && (
              <FXConfig
                availableFx={availableFx}
                activeFx={fxBindings[state]}
                fxVal={fxValueBindings[state]}
                onFxChange={(value) => onFxChange(value, state)}
                onFxValChange={(value) => onFxValChange(value, state)}
              />
            )}
            <div className="separator" />
          </div>
        );
      })}
    </>
  );
}
