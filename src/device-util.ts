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
