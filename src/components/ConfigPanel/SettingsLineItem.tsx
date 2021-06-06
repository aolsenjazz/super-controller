import React from 'react';

import BasicSelect from './BasicSelect';

type SettingsLineItemPropTypes = {
  label: string;
  value: string | number | null;
  valueList: string[] | number[];
  labelList: string[];
  onChange: (val: string | number) => void;
};

export default function SettingsLineItem(props: SettingsLineItemPropTypes) {
  const { label, value, valueList, onChange, labelList } = props;
  return (
    <div className="settings-line">
      <p>{label}</p>
      <BasicSelect
        value={value}
        valueList={valueList}
        labelList={labelList}
        onChange={onChange}
      />
    </div>
  );
}
