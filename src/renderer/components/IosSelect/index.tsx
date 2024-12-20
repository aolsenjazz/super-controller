import './IosSelect.css';

type PropTypes<T extends string | number> = {
  valueList: T[];
  labelList: string[];
  value: T;
  placeholder?: string;
  onChange: (value: T) => void;
};

export default function IosSelect<T extends string | number>(
  props: PropTypes<T>,
) {
  const { valueList, value, onChange, labelList, placeholder } = props;
  const isMultiple = value === '<multiple values>';

  return (
    <div className="ios-select">
      <select
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          const isNum = /^\d+$/.test(newValue);
          const v = isNum ? parseInt(newValue, 10) : newValue;
          onChange(v as T);
        }}
      >
        {placeholder !== undefined ? (
          <option value="" disabled>
            {placeholder}
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

const defaultProps = {
  placeholder: undefined,
};
IosSelect.defaultProps = defaultProps;
