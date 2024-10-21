import type { FxDriver } from '@shared/driver-types/fx-driver';
import { msgEquals } from '@shared/util';
import Slider from './Slider';

function indexOfArr(arr: number[], arrays: number[][]) {
  for (let i = 0; i < arrays.length; i++) {
    if (msgEquals(arr, arrays[i])) return i;
  }

  throw new Error('woops');
}

type PropTypes = {
  availableFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxValueArr?: MidiNumber[];
  onFxChange: (state: number, fx: FxDriver) => void;
  onFxValueChange: (state: number, arr: MidiNumber[]) => void;
  state: number;
};

export default function FxSelect(props: PropTypes) {
  const {
    availableFx,
    activeFx,
    fxValueArr,
    onFxChange,
    onFxValueChange,
    state,
  } = props;

  const value = activeFx ? activeFx.title : 'unset';
  const options: JSX.Element[] = [];

  if (value === 'unset') options.push(<option value="unset">Unset</option>);

  availableFx.forEach((fx) => {
    options.push(
      <option key={fx.title} value={fx.title}>
        {fx.title}
      </option>
    );
  });

  const innerFxChange = (title: string) => {
    const fx = availableFx.find((f) => f.title === title);

    if (!fx) throw new Error(`could not locate fx with title ${title}`);

    onFxChange(state, fx);
  };

  const innerFxValueChange = (val: number) => {
    const arr = activeFx!.validVals[val];
    onFxValueChange(state, arr);
  };

  return (
    <div className="fx-setting">
      <label>
        FX:
        <select value={value} onChange={(e) => innerFxChange(e.target.value)}>
          {options}
        </select>
      </label>
      {activeFx &&
        (() => {
          const defaultIndex = indexOfArr(
            activeFx.defaultVal,
            activeFx.validVals
          );
          const currentIndex = !fxValueArr
            ? 0
            : indexOfArr(fxValueArr, activeFx.validVals);

          return (
            <Slider
              defaultVal={
                currentIndex !== undefined ? currentIndex : defaultIndex
              }
              domain={[0, activeFx.validVals.length - 1]}
              highBoundLabel={activeFx.highBoundLabel!}
              lowBoundLabel={activeFx.lowBoundLabel!}
              onChange={innerFxValueChange}
            />
          );
        })()}
    </div>
  );
}
