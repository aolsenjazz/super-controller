import { useCallback } from 'react';

import { FxDriver } from '@shared/driver-types';

import BasicSelect from './BasicSelect';
import IosSlider from '../IosSlider';

type Props = {
  eligibleFx: FxDriver[];
  activeFx: FxDriver | undefined;
  fxVal: Channel | undefined | '<multiple values>';
  onFxChange: (title: string) => void;
  onFxValChange: (val: Channel) => void;
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
      onFxValChange(v as Channel);
    },
    [onFxValChange]
  );

  const valueList = eligibleFx.map((fx) => fx.title);

  return (
    <div className="settings-line fx-setting">
      <p>FX:</p>
      <BasicSelect
        value={activeFx?.title}
        valueList={valueList}
        labelList={valueList}
        onChange={innerFxChange}
      />
      {activeFx &&
      activeFx.title !== '<multiple values>' &&
      fxVal &&
      fxVal !== '<multiple values>' ? (
        <IosSlider
          lowBoundLabel={activeFx.lowBoundLabel!}
          highBoundLabel={activeFx.highBoundLabel!}
          domain={[
            Math.min(...activeFx.validVals) as Channel,
            Math.max(...activeFx.validVals) as Channel,
          ]}
          defaultVal={fxVal}
          onChange={innerFxValChange}
        />
      ) : null}
    </div>
  );
}
