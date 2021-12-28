import { MidiValue, MidiMessage } from 'midi-message-parser';

type PropTypes = {
  currentAction: MidiValue[] | null;
  setCurrentAction: (action: MidiValue[]) => void;
  overrideKey: string;
};

export default function OverrideRow(props: PropTypes) {
  const { currentAction, setCurrentAction, overrideKey } = props;

  const selected = JSON.stringify(currentAction) === overrideKey;
  const keyAsNumArray = overrideKey
    .replaceAll(/\[|\]/g, '')
    .split(',')
    .map((stringVal) => parseInt(stringVal, 10)) as MidiValue[];
  const keyAsMm = new MidiMessage(keyAsNumArray, 0);

  const onClick = () => {
    setCurrentAction(keyAsNumArray);
  };

  return (
    <div
      className={`column header row ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
    >
      <p className="column event">{keyAsMm.type}</p>
      <p className="column number">{keyAsMm.number}</p>
      <p className="column channel">{keyAsMm.channel}</p>
    </div>
  );
}
