import type { Color, FxDriver } from '../../../types';
import type { BacklightControlDTO } from '..';

import ColorSelect from './ColorSelect';
import FxSelect from './FxSelect';

type PropTypes = {
  availableStates: number[];
  colorBindings: BacklightControlDTO['colorBindings'];
  fxBindings: BacklightControlDTO['fxBindings'];
  fxValueBindings: BacklightControlDTO['fxValueBindings'];
  availableColors: BacklightControlDTO['availableColors'];
  availableFx: BacklightControlDTO['availableFx'];
  onColorChange: (n: number, c: Color) => void;
  onFxChange: (state: number, fx: FxDriver) => void;
  onFxValueChange: (state: number, arr: MidiNumber[]) => void;
};

export default function BinaryColorSelect(props: PropTypes) {
  const {
    availableStates,
    colorBindings,
    availableColors,
    availableFx,
    fxBindings,
    fxValueBindings,
    onColorChange,
    onFxChange,
    onFxValueChange,
  } = props;

  return (
    <>
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
    </>
  );
}
