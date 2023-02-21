import { useCallback } from 'react';

import { FxDriver } from '@shared/driver-types';

import BasicSelect from './BasicSelect';
import IosSlider from '../IosSlider';

type Props = {
  eligibleFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxVal: MidiNumber[] | undefined | '<multiple values>';
  onFxChange: (title: string) => void;
  onFxValChange: (val: MidiNumber[]) => void;
};

export default function FXConfig(props: Props) {
  const { eligibleFx, activeFx, onFxChange, onFxValChange, fxVal } = props;

  const innerFxChange = useCallback(
    (v: string | number) => {
      onFxChange(v as string);
    },
    [onFxChange]
  );

  const innerFxValChange = useCallback(
    (v: string | number) => {
      onFxValChange(activeFx!.validVals[v as number]);
    },
    [onFxValChange, activeFx]
  );

  const valueList = eligibleFx.map((fx) => fx.title);

  let SliderOrNull = null;
  if (
    activeFx &&
    activeFx.title !== '<multiple values>' &&
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
      <IosSlider
        lowBoundLabel={activeFx.lowBoundLabel!}
        highBoundLabel={activeFx.highBoundLabel!}
        domain={[0, activeFx.validVals.length - 1]}
        defaultVal={defaultVal}
        onChange={innerFxValChange}
      />
    );
  }

  return (
    <div className="settings-line fx-setting">
      <p>FX:</p>
      <BasicSelect
        value={activeFx?.title}
        valueList={valueList}
        labelList={valueList}
        onChange={innerFxChange}
      />
      {SliderOrNull}
    </div>
  );
}
