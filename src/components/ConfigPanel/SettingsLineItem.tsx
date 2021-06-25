import React from 'react';

import BasicSelect from './BasicSelect';

type SettingsLineItemPropTypes = {
  label: string;
  value: string | number | null;
  valueList: string[] | number[];
  labelList: string[];
  onChange: (val: string | number) => void;
};

/**
 * @callback onChange
 * @param { string | number } val The newly-selected value
 */

/**
 * Contains a label and dropdown for a configurable settings
 *
 * @param { object } props Component props
 * @param { string } props.label The name of the setting
 * @param { string | number | null } props.value The current value of the setting
 * @param { string[] | number[] } props.valueList All eligible values for the setting
 * @param { string[] } props.labelList String representation of all value in valueList
 * @param { onChange } onChange Value change callback
 */
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
