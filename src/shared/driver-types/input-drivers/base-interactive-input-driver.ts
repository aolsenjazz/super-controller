import { BaseInputDriver } from './base-input-driver';

export interface BaseInteractiveInputDriver extends BaseInputDriver {
  /* Can the input be overridden? `false` if the input cannot send or react to MIDI data */
  readonly interactive: true;
}
