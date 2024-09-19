import { useEffect, useState } from 'react';
import { MidiEvent } from './midi-event';
import { getStatusString, readableTime, rowId } from './utils';

const { HostService } = window;

type MidiEventTableProps = {
  setSelectedSource: (source: NumberArrayWithStatus) => void;
  deviceName: string;
  deviceId: string;
};

export function MidiEventTable(props: MidiEventTableProps) {
  const { setSelectedSource, deviceName, deviceId } = props;

  const [midiEvents, setMidiEvents] = useState<MidiEvent[]>([]);
  const [selectedRow, setSelectedRow] = useState<string>('');

  useEffect(() => {
    const off = HostService.addMidiEventListener((devId, msg) => {
      if (deviceId !== devId) return;

      setMidiEvents((prevMidiEvents) => {
        const newMidiEvents = [
          { deviceId, msg, time: readableTime() },
          ...prevMidiEvents,
        ];
        return newMidiEvents.slice(0, 10);
      });
    });

    return () => off();
  }, [setMidiEvents, deviceId]);

  const rows = midiEvents.map((event) => {
    const id = rowId(event);
    const selected = id === selectedRow;

    const onClick = () => {
      setSelectedRow(selected ? '' : id);
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
