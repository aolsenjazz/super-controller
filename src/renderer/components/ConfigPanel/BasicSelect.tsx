import SelectTab from '../../assets/select-tab.svg';

type PropTypes = {
  valueList: (string | number)[];
  labelList: string[];
  value: string | number | null;
  usePlaceholder: boolean;
  onChange: (value: string | number) => void;
};

/**
 * @callback onChange
 * @param value The new value
 */

/**
 * Simple dropdown select
 *
 * @param props Component props
 * @param props.valueList List of values
 * @param props.labelList String representation of the value in props.valueList
 * @param props.value Current value
 * @param onChange Value change callback
 */
export default function BasicSelect(props: PropTypes) {
  const { valueList, value, onChange, labelList, usePlaceholder } = props;
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
        {usePlaceholder === true ? (
          <option value="" disabled>
            Choose your device
          </option>
        ) : null}
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
