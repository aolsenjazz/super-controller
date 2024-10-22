import { useMemo } from 'react';
import { toString, statusByteMap } from '../util';

function midiArrayToDropdownOption(arr: NumberArrayWithStatus) {
  const statusByte = arr[0];
  const status = statusByte & 0xf0;

  const statusString = statusByteMap[status];
  return `${statusString}: ${JSON.stringify(arr)}`;
}

function toNumberArray(msg: string) {
  return msg.split('.').map((s) => Number(s)) as NumberArrayWithStatus;
}

type PropTypes = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus) => void;
  overrides: Record<string, NumberArrayWithStatus | undefined>;
};

export default function EventSelector(props: PropTypes) {
  const { selectedSource, setSelectedSource, overrides } = props;

  const options: JSX.Element[] = [];
  const saved = selectedSource && overrides[toString(selectedSource)];

  const selectValue = useMemo(() => {
    return (selectedSource && toString(selectedSource)) || 'header-option';
  }, [selectedSource]);

  const msg = Object.keys(overrides)
    ? `Select an override: (${Object.keys(overrides).length} total)`
    : 'No overrides set.';
  options.push(
    <option disabled key="header-option" value="header-option">
      {msg}
    </option>
  );

  if (selectedSource && !saved) {
    options.push(
      <option
        key={selectedSource && toString(selectedSource)}
        value={selectedSource && toString(selectedSource)}
      >
        {`${midiArrayToDropdownOption(selectedSource)}${
          saved ? '' : ' (unsaved)'
        }`}
      </option>
    );
  }

  Object.keys(overrides).forEach((source) => {
    const index = Object.keys(overrides).indexOf(source);
    options.push(
      <option key={`${source} ${index}`} value={source}>
        {midiArrayToDropdownOption(toNumberArray(source))}
      </option>
    );
  });

  const onSelectEvent = (value: string) => {
    setSelectedSource(toNumberArray(value));
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
