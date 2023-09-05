import BasicSelect from '../BasicSelect';

type SettingsLineItemPropTypes = {
  label: string;
  value: string | number | undefined;
  valueList: string[] | number[];
  labelList: string[];
  onChange: (val: string | number) => void;
};

/**
 * @callback onChange
 * @param val The newly-selected value
 */

/**
 * Contains a label and dropdown for a configurable settings
 *
 * @param props Component props
 * @param props.label The name of the setting
 * @param props.value The current value of the setting
 * @param props.valueList All eligible values for the setting
 * @param props.labelList String representation of all value in valueList
 * @param props.onChange Value change callback
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
