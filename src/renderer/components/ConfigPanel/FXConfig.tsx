import { useCallback } from 'react';

import { ColorImpl } from '@shared/hardware-config';

import BasicSelect from './BasicSelect';

type Props = {
  eligibleFx: ColorImpl['fx'];
  activeFx: string | null;
  onFxChange: (title: string) => void;
  onFxValChange: (val: Channel) => void;
};

export default function FXConfig(props: Props) {
  const { eligibleFx, activeFx, onFxChange, onFxValChange } = props;

  const value = activeFx;
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
  console.log(innerFxValChange);

  const valueList = eligibleFx.map((fx) => fx.title);

  return (
    <div className="settings-line fx-setting">
      <p>FX:</p>
      <BasicSelect
        placeholder="--"
        value={value}
        valueList={valueList}
        labelList={valueList}
        onChange={innerFxChange}
      />
    </div>
  );
}
