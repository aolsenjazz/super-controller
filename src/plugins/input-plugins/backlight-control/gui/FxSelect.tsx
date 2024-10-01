import { FxDriver } from '@shared/driver-types';
import Slider from './Slider';

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
    const arr = activeFx!.defaultVal.map((n) => {
      return n === 0 ? 0 : val;
    }) as MidiNumber[];

    onFxValueChange(state, arr);
  };

  return (
    <div className="fx-setting">
      <p>FX:</p>
      <select value={value} onChange={(e) => innerFxChange(e.target.value)}>
        {options}
      </select>
      {activeFx &&
        (() => {
          const defaultVal = activeFx.defaultVal.filter((n) => n !== 0)[0];
          const fxValue = fxValueArr?.filter((n) => n !== 0)[0] || 0;

          return (
            <Slider
              defaultVal={fxValue !== undefined ? fxValue : defaultVal}
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
