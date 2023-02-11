import { MidiArray } from '@shared/midi-array';

type PropTypes = {
  currentAction: MidiArray | undefined;
  setCurrentAction: (action: MidiArray) => void;
  overrideKey: string;
};

export default function OverrideRow(props: PropTypes) {
  const { currentAction, setCurrentAction, overrideKey } = props;

  const selected = JSON.stringify(currentAction) === overrideKey;
  const keyAsNumArray = overrideKey
    .replaceAll(/\[|\]/g, '')
    .split(',')
    .map((stringVal) => parseInt(stringVal, 10)) as MidiTuple;
  const asMsg = new MidiArray(keyAsNumArray);

  const onClick = () => {
    setCurrentAction(asMsg);
  };

  return (
    <div
      className={`column header row ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <p className="column event">{asMsg.statusString}</p>
      <p className="column number">{asMsg.number}</p>
      <p className="column channel">{asMsg.channel}</p>
    </div>
  );
}
