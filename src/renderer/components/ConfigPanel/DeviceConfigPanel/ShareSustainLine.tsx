import { useCallback } from 'react';

type PropTypes = {
  name: string;
  value: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * @callback onChange
 * @param checked Checkbox value
 */

/**
 * Contains device name and checkbox representing whether or not sustain is shared with said device
 *
 * @param props Component props
 * @param props.name Name of the device sustain can be shared with
 * @param props.value Is sustain currently shared with this device?
 * @param props.onChange Value change callback
 */
export default function ShareSustainLine(props: PropTypes) {
  const { name, value, onChange } = props;

  const change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange]
  );

  return (
    <div className="share-sustain">
      <input type="checkbox" checked={value} onChange={change} />
      <p>{name}</p>
    </div>
  );
}
