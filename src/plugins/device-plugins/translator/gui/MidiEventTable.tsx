import { useEffect, useState } from 'react';

import { selectRecentRemoteMessagesById } from '@features/recent-remote-messages/recent-remote-messages-slice';
import { useAppSelector } from '@hooks/use-app-dispatch';

import { getStatusString, rowId } from '../util';

function NoRecentMessages({ deviceName }: { deviceName: string }) {
  return (
    <div id="no-recent-messages">
      <p>
        No recent messages from {deviceName}. Press/move an input on your
        controller.
      </p>
    </div>
  );
}

type MidiEventTableProps = {
  setSelectedSource: (source: NumberArrayWithStatus | undefined) => void;
  deviceName: string;
  deviceId: string;
};

export function MidiEventTable(props: MidiEventTableProps) {
  const { setSelectedSource, deviceName, deviceId } = props;

  const recentMessages = useAppSelector(
    selectRecentRemoteMessagesById(deviceId, 10)
  );

  useEffect(() => {}, [recentMessages]);

  const [selectedRow, setSelectedRow] = useState<string>('');

  const rows = recentMessages.map((event) => {
    const id = rowId(event);
    const selected = id === selectedRow;

    const onClick = () => {
      setSelectedRow(id);
      setSelectedSource(event.msg);
    };

    return (
      <div
        role="presentation"
        className={`row ${selected ? 'selected' : ''}`}
        key={id}
        onClick={onClick}
      >
        <div className="cell time-cell">{getStatusString(event.msg)}</div>
        <div className="cell message-cell">{JSON.stringify(event.msg)}</div>
      </div>
    );
  });

  return (
    <div>
      <div className="table">
        <div className="header">
          <div className="cell time-header">Event</div>
          <div className="cell message-header">Data</div>
        </div>
        <div className="body">
          {rows.length ? rows : <NoRecentMessages deviceName={deviceName} />}
        </div>
      </div>
    </div>
  );
}
