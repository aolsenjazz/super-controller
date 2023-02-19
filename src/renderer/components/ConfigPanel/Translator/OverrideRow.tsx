import { MidiArray, create, ThreeByteMidiArray } from '@shared/midi-array';

type PropTypes = {
  currentAction: MidiArray | undefined;
  setCurrentAction: (action: MidiArray) => void;
  overrideKey: string;
};

export default function OverrideRow(props: PropTypes) {
  const { currentAction, setCurrentAction, overrideKey } = props;

  const selectedId = currentAction ? JSON.stringify(currentAction.array) : '';
  const selected = selectedId === overrideKey;
  const keyAsNumArray = overrideKey
    .replaceAll(/\[|\]/g, '')
    .split(',')
    .map((stringVal) => parseInt(stringVal, 10)) as MidiTuple;
  const asMsg = create(keyAsNumArray);

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
      <p className="column number">{(asMsg as ThreeByteMidiArray).number}</p>
      <p className="column channel">{(asMsg as ThreeByteMidiArray).channel}</p>
    </div>
  );
}
