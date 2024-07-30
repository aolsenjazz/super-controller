import { MidiArray, ThreeByteMidiArray } from '@shared/midi-array';
import { DeviceIcicle } from '@shared/hardware-config/device-config';
import { useRecentMessage } from '@hooks/use-recent-message';

type RecentMessageRowPropTypes = {
  config: DeviceIcicle;
  setCurrentAction: (msg: MidiArray) => void;
  currentAction: MidiArray | undefined;
};

export default function RecentMessageRow(props: RecentMessageRowPropTypes) {
  const { config, setCurrentAction, currentAction } = props;
  const { recentMsg } = useRecentMessage(config.id);

  const selected =
    recentMsg && JSON.stringify(currentAction) === JSON.stringify(recentMsg);

  if (recentMsg === undefined) return null;

  return (
    <div
      className={`row recent ${selected ? 'selected' : ''}`}
      onClick={() => setCurrentAction(recentMsg)}
      onKeyDown={() => {}}
      tabIndex={0}
      role="button"
    >
      {recentMsg && (
        <>
          <p className="column event">{recentMsg.statusString}</p>
          <p className="column number">
            {(recentMsg as ThreeByteMidiArray).number}
          </p>
          <p className="column channel">
            {(recentMsg as ThreeByteMidiArray).channel}
          </p>
        </>
      )}
    </div>
  );
}
