import { getStatus, getChannel } from '@shared/midi-util';

type PropTypes = {
  currentAction: number[] | null;
  setCurrentAction: (action: number[]) => void;
  overrideKey: string;
};

export default function OverrideRow(props: PropTypes) {
  const { currentAction, setCurrentAction, overrideKey } = props;

  const selected = JSON.stringify(currentAction) === overrideKey;
  const keyAsNumArray = overrideKey
    .replaceAll(/\[|\]/g, '')
    .split(',')
    .map((stringVal) => parseInt(stringVal, 10)) as number[];

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
      <p className="column event">{getStatus(keyAsNumArray).string}</p>
      <p className="column number">{keyAsNumArray[1]}</p>
      <p className="column channel">{getChannel(keyAsNumArray)}</p>
    </div>
  );
}
