import { MidiValue, Channel } from 'midi-message-parser';

/* Return the input id for the given details. Used by both `InputConfig` and `VirtualInput`s */
export function inputIdFor(
  number: MidiValue,
  channel: Channel,
  eventType: string
) {
  if (eventType === 'pitchbend') {
    return `${eventType}.${channel}`;
  }

  let parsedEventType = eventType;
  if (['noteon', 'noteoff'].includes(parsedEventType))
    parsedEventType = 'noteon/noteoff';
  return `${parsedEventType}.${channel}.${number}`;
}

/**
 * Retrieves device/port name from id
 *
 * @param { string } id The id of the device/port
 * @return { string } The name of the device/port
 */
export function nameFromId(id: string) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  return id.substring(0, lastSpaceIdx);
}
