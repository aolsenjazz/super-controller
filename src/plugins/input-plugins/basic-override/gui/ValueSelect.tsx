type ValueSelectProps = {
  defaultValue: MidiNumber;
  valueOverride: MidiNumber;
  onValueChange: (value: MidiNumber) => void;
};

export function ValueSelect(props: ValueSelectProps) {
  const { defaultValue, valueOverride, onValueChange } = props;

  const numbers = Array.from(Array(128).keys());
  const numberLabels = numbers.map((n) => {
    return `${n}${n === defaultValue ? ' [default]' : ''}`;
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value) as MidiNumber;
    onValueChange(value);
  };

  return (
    <label>
      Value:
      <select value={valueOverride} onChange={handleChange}>
        {numbers.map((n, i) => (
          <option key={n} value={n}>
            {numberLabels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
