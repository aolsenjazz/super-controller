import { InteractiveInputDriver } from './interactive-input-driver';

export interface PadDriver extends InteractiveInputDriver {
  type: 'pad';
  value?: MidiNumber;
}
