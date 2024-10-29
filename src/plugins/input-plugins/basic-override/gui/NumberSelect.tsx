import { CC_BINDINGS, NOTE_BINDINGS } from '../util';

type NumberSelectProps = {
  defaultNumber: MidiNumber;
  numberOverride: MidiNumber;
  statusOverride: StatusString | 'noteon/noteoff';
  onNumberChange: (number: MidiNumber) => void;
};

export function NumberSelect(props: NumberSelectProps) {
  const { defaultNumber, numberOverride, statusOverride, onNumberChange } =
    props;

  const numbers = Array.from(Array(128).keys());
  const numberLabels = numbers.map((n) => {
    let additionalInfo = '';

    if (statusOverride !== 'programchange') {
      additionalInfo =
        statusOverride === 'controlchange'
          ? `: ${CC_BINDINGS.get(n)!}`
          : `: ${NOTE_BINDINGS.get(n)!}`;
    }

    return `${n}${additionalInfo}${n === defaultNumber ? ' [default]' : ''}`;
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const number = Number(e.target.value) as MidiNumber;
    onNumberChange(number);
  };

  return (
    <label>
      Number:
      <select value={numberOverride} onChange={handleChange}>
        {numbers.map((n, i) => (
          <option key={n} value={n}>
            {numberLabels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
