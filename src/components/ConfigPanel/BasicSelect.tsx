import React from 'react';

import SelectTab from '../../assets/select-tab.svg';

type PropTypes = {
  valueList: (string | number)[];
  labelList: string[];
  value: string | number | null;
  onChange: (value: string | number) => void;
};

/**
 * @callback onChange
 * @param { string | number } value The new value
 */

/**
 * Simple dropdown select
 *
 * @param { object } props Component props
 * @param { (string | number)[] } props.valueList List of values
 * @param { string[] } props.labelList String representation of the value in props.valueList
 * @param { string | number | null } props.value Current value
 * @param { onChange } onChange Value change callback
 */
export default function BasicSelect(props: PropTypes) {
  const { valueList, value, onChange, labelList } = props;
  const isMultiple = value === '<multiple values>';

  return (
    <div className="ios-select">
      <div className="ios-select-tab">
        <img src={SelectTab} alt="" />
        <img src={SelectTab} alt="" />
      </div>
      <select
        value={value || ''}
        onChange={(e) => {
          const newValue = e.target.value;
          const isNum = /^\d+$/.test(newValue);
          const v = isNum ? parseInt(newValue, 10) : newValue;
          onChange(v);
        }}
      >
        {isMultiple ? (
          <option value="<multiple values>" disabled>
            &#60;Multiple Values&#62;
          </option>
        ) : null}
        {valueList.map((v, i) => (
          <option value={v} key={v}>
            {labelList[i]}
          </option>
        ))}
      </select>
    </div>
  );
}
