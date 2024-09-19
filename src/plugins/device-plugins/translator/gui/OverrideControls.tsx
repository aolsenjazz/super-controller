// OverrideControls.tsx
import { MidiEventOverride } from '../midi-event-override';
import { statusByteMap } from './utils';

function midiArrayToDropdownOption(arr: NumberArrayWithStatus) {
  const statusByte = arr[0];
  const status = statusByte & 0xf0;

  const statusString = statusByteMap[status];
  return `${statusString}: ${JSON.stringify(arr)}`;
}

type OverrideControlsProps = {
  selectedSource: NumberArrayWithStatus | undefined;
  setSelectedSource: (source: NumberArrayWithStatus) => void;
  overrides: MidiEventOverride[];
  setOverrides: (overrides: MidiEventOverride[]) => void;
};

export function OverrideControls(props: OverrideControlsProps) {
  const { selectedSource, setSelectedSource, overrides, setOverrides } = props;

  const options: JSX.Element[] = [];
  if (selectedSource === undefined) {
    options.push(<option key="no-overrides">No overrides set.</option>);
  }

  overrides.forEach(({ source }) => {
    options.push(
      <option key={JSON.stringify(source)} value={JSON.stringify(source)}>
        {midiArrayToDropdownOption(source)}
      </option>
    );
  });

  const onSelectEvent = (value: string) => {
    console.log(value);
  };

  return (
    <div className="override-controls">
      <div>
        <select
          id="event-selector"
          value={JSON.stringify(selectedSource)}
          onChange={(e) => onSelectEvent(e.target.value)}
        >
          {options}
        </select>
      </div>
    </div>
  );
}

/*
<div>
        <label htmlFor="override-status">
          Status String:
          <select
            id="override-status"
            value={statusString}
            onChange={(e) => setStatusString(e.target.value)}
          >
            {statusStrings.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="override-channel">
          Channel:
          <input
            id="override-channel"
            type="number"
            min="0"
            max="15"
            value={channel}
            onChange={(e) => setChannel(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label htmlFor="override-number">
          MIDI Number:
          <input
            id="override-number"
            type="number"
            min="0"
            max="127"
            value={midiNumber}
            onChange={(e) => setMidiNumber(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label htmlFor="override-value">
          Value:
          <input
            id="override-value"
            type="number"
            min="0"
            max="127"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
      </div>*/
