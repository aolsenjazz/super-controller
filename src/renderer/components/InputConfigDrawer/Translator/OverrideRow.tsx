import { MidiArray, TwoByteMidiArray } from '@shared/midi-array';
import { parse } from '@shared/util';

type PropTypes = {
  currentAction: MidiArray | undefined;
  setCurrentAction: (action: MidiArray) => void;
  overrideKey: string;
};

export default function OverrideRow(props: PropTypes) {
  const { currentAction, setCurrentAction, overrideKey } = props;

  const selected = JSON.stringify(currentAction) === overrideKey;
  const asMsg = parse<MidiArray>(overrideKey);

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
      <p className="column number">{(asMsg as TwoByteMidiArray).number}</p>
      <p className="column channel">{(asMsg as TwoByteMidiArray).channel}</p>
      <p className="column value">{asMsg.length === 3 ? asMsg[2] : ''}</p>
    </div>
  );
}
