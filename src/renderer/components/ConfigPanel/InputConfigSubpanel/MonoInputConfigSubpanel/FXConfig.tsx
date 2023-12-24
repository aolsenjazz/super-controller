import { FxDriver } from '@shared/driver-types';

import BasicSelect from '../../../BasicSelect';
import IosSlider from '../../../IosSlider';

type Props = {
  eligibleFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxVal: MidiNumber[] | undefined | '<multiple values>';
  onChange: (fx: FxDriver, fxVal: MidiNumber[]) => void;
};

export default function FXConfig(props: Props) {
  const { eligibleFx, activeFx, onChange, fxVal } = props;

  const valueList = eligibleFx.map((fx) => fx.title);

  let defaultVal = 0;
  let showValueSlider = false;

  if (
    activeFx &&
    activeFx.title !== '<multiple values>' &&
    fxVal &&
    fxVal !== '<multiple values>'
  ) {
    activeFx.validVals.forEach((arr, i) => {
      if (JSON.stringify(arr) === JSON.stringify(fxVal)) {
        defaultVal = i;
      }
    });
    showValueSlider = true;
  }

  return (
    <div className="settings-line fx-setting">
      <p>FX:</p>
      <BasicSelect
        value={activeFx?.title || ''}
        valueList={valueList}
        labelList={valueList}
        onChange={(fxTitle) => {
          const fx = eligibleFx.filter((f) => f.title === fxTitle)[0];
          onChange(fx, fx.defaultVal);
        }}
      />
      {showValueSlider && activeFx && (
        <IosSlider
          lowBoundLabel={activeFx.lowBoundLabel!}
          highBoundLabel={activeFx.highBoundLabel!}
          domain={[0, activeFx.validVals.length - 1]}
          defaultVal={defaultVal}
          onChange={(validValsIdx) => {
            const fv = activeFx.validVals[validValsIdx];
            onChange(activeFx, fv);
          }}
        />
      )}
    </div>
  );
}
