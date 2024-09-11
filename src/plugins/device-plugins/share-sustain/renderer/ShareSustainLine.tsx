import { useCallback } from 'react';

type PropTypes = {
  name: string;
  value: boolean;
  onChange: (checked: boolean) => void;
};

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
