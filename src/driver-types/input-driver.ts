import { MidiValue, EventType, Channel } from 'midi-message-parser';
import { Color } from './color';

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  readonly number: MidiValue;
  readonly channel: Channel;
  readonly eventType: EventType;
  readonly response: 'gate' | 'toggle' | 'linear';
};

export type InputDriver = {
  default: InputDefault;
  shape: 'circle' | 'rect';
  type: 'knob' | 'pad' | 'slider' | 'wheel';
  availableColors: Color[];
  overrideable: boolean;
};
