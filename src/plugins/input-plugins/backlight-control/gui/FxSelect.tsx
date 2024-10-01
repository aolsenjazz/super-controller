import { FxDriver } from '@shared/driver-types';

type PropTypes = {
  availableFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxVal: MidiNumber[] | undefined | '<multiple values>';
  onFxChange: (id: string) => void;
  onFxValChange: (val: MidiNumber[]) => void;
};

export default function FxSelect(props: PropTypes) {
  const { availableFx, activeFx, fxVal } = props;

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
