import { useMemo } from 'react';
import { MidiEventOverride } from '../midi-event-override';
import { statusByteMap } from './utils';

function midiArrayToDropdownOption(arr: NumberArrayWithStatus) {
  const statusByte = arr[0];
  const status = statusByte & 0xf0;

  const statusString = statusByteMap[status];
  return `${statusString}: ${JSON.stringify(arr)}`;
}

type PropTypes = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus) => void;
  overrides: MidiEventOverride[];
};

export default function EventSelector(props: PropTypes) {
  const { selectedSource, setSelectedSource, overrides } = props;

  const options: JSX.Element[] = [];
  const saved = overrides.find(
    (o) => JSON.stringify(o.source) === JSON.stringify(selectedSource)
  );

  const selectValue = useMemo(() => {
    return JSON.stringify(selectedSource) || 'header-option';
  }, [selectedSource]);

  const msg = overrides.length
    ? `Select an override: (${overrides.length} total)`
    : 'No overrides set.';
  options.push(
    <option disabled key="header-option" value="header-option">
      {msg}
    </option>
  );

  if (
    selectedSource &&
    !overrides.find(
      (o) => JSON.stringify(o.source) === JSON.stringify(selectedSource)
    )
  ) {
    options.push(
      <option
        key={JSON.stringify(selectedSource)}
        value={JSON.stringify(selectedSource)}
      >
        {`${midiArrayToDropdownOption(selectedSource)}${
          !saved && ' (unsaved)'
        }`}
      </option>
    );
  }

  overrides.forEach(({ source }) => {
    options.push(
      <option key={JSON.stringify(source)} value={JSON.stringify(source)}>
        {midiArrayToDropdownOption(source)}
      </option>
    );
  });

  const onSelectEvent = (value: string) => {
    setSelectedSource(JSON.parse(value));
  };

  return (
    <div className="event-selector">
      <select
        value={selectValue}
        onChange={(e) => onSelectEvent(e.target.value)}
      >
        {options}
      </select>
    </div>
  );
}
