import { MidiValue, Channel, MidiMessage } from 'midi-message-parser';
import { Color } from './driver-types';

/**
 * Return the input id for the given details. Used by both `InputConfig` and `VirtualInput`s
 *
 * TODO: Probably should move this to an abstract class
 *
 * @param { MidiValue } number The MIDI number (note value, CC number, etc)
 * @param { Channel } channel The MIDI channel
 * @param { string } eventType The event type
 * @return { string } The ID of the input
 */
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
