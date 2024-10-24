/**
 * Contains re-exports necessary for core plugin functionality. Re-exports should
 * be minimized in pursuit of enforcing a hard boundary between plugin and
 * and main application source code.
 */

// message processing
export type {
  MessageProcessor,
  MessageProcessorMeta,
} from '../shared/message-processor';
export type { MessageTransport } from '../shared/message-transport';
export type { TimestampedMidiEvent } from '../shared/timestamped-midi-event';

// config types
export type { BaseInputConfig } from '../shared/hardware-config/input-config/base-input-config';
export type { BaseInteractiveInputDriver } from '../shared/driver-types/input-drivers/base-interactive-input-driver';
export type { DeviceConfigDTO } from '../shared/hardware-config/device-config';

// driver types
export type { MonoInteractiveDriver } from '../shared/driver-types/input-drivers/mono-interactive-driver';
export type { SwitchDriver } from '../shared/driver-types/input-drivers/switch-driver';
export type { BaseInputDriver } from '../shared/driver-types/input-drivers/base-input-driver';
export type { Color } from '../shared/driver-types/color';
export type { FxDriver } from '../shared/driver-types/fx-driver';
