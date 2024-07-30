import { InputDriver } from './input-driver';

export interface InteractiveInputDriver extends InputDriver {
  /* Can the input be overridden? `false` if the input cannot send or react to MIDI data */
  readonly interactive: true;
}
