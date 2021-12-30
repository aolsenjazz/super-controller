import { MidiValue, Channel, MidiMessage } from 'midi-message-parser';
import { Color } from './driver-types';

/**
 * Return the input id for the given details. Used by both `InputConfig` and `VirtualInput`s
 *
 * TODO: Probably should move this to an abstract class
 *
 * @param { MidiValue | MidiMessage } numOrMsg The MIDI number (note value, CC number, etc) or MidiMessage
 * @param { Channel } channel The MIDI channel
 * @param { string } eventType The event type
 * @return { string } The ID of the input
 */
export function inputIdFor(
  numOrMsg: MidiValue | MidiMessage,
  channel?: Channel,
  eventType?: string
) {
  let n: MidiValue;
  let c: Channel;
  let e: string;
  if (numOrMsg instanceof MidiMessage) {
    n = numOrMsg.number;
    c = numOrMsg.channel;
    e = numOrMsg.type;
  } else {
    if (channel === undefined || eventType === undefined)
      throw new Error('channel && eventType must be truthy');
    n = numOrMsg;
    c = channel;
    e = eventType;
  }

  if (e === 'pitchbend') {
    return `${e}.${c}`;
  }

  let parsedEventType = e;
  if (['noteon', 'noteoff'].includes(parsedEventType))
    parsedEventType = 'noteon/noteoff';
  return `${parsedEventType}.${c}.${n}`;
}

/**
 * Convert an input id string to a MidiMessage
 *
 * @param { string } id The input ID
 * @return { MidiMessage } A MidiMessage representation
 */
export function inputIdToMidiMessage(id: string) {
  const parts = id.split('.');
  const channel = parseInt(parts[1], 10);

  if (id.includes('pitchbend')) {
    return new MidiMessage('pitchbend', 0, channel, 0, 0);
  }

  const eventType = parts[0];
  const number = parseInt(parts[2], 10) as MidiValue;

  return new MidiMessage(eventType, number, channel, 0, 0);
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

/**
 * Returns the message to be send to devices in order to trigger the given color.
 *
 * @param { MidiValue } number The MIDI number
 * @param { Channel } channel The MIDI channel
 * @param { Color | undefined } c The color to set
 * @return { MidiMessage | undefined }
 */
export function msgForColor(number: MidiValue, channel: Channel, c?: Color) {
  if (!c) return undefined;
  return new MidiMessage(c.eventType, number, c.value, channel, 0);
}