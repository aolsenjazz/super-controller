import BasicSelect from '../BasicSelect';

type SettingsLineItemPropTypes<T extends string | number> = {
  label: string;
  value: string | number;
  valueList: T[];
  labelList: string[];
  onChange: (val: T) => void;
};

export default function SettingsLineItem<T extends string | number>(
  props: SettingsLineItemPropTypes<T>
) {
  const { label, value, valueList, onChange, labelList } = props;
  return (
    <div className="settings-line">
      <p>{label}</p>
      <BasicSelect
        value={value}
        valueList={valueList}
        labelList={labelList}
        onChange={onChange as (val: unknown) => void}
      />
    </div>
  );
}
