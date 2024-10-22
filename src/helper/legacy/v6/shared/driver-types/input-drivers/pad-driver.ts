import { MonoInteractiveDriver } from './mono-interactive-driver';

export interface PadDriver extends MonoInteractiveDriver {
  type: 'pad';
}
