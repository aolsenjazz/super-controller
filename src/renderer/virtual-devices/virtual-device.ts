import {
  KeyboardDriver,
  DeviceStyle,
  DeviceDriver,
  InputGridDriver,
} from '@shared/driver-types';
import { VirtualInputGrid } from './virtual-input-grid';

/**
 * Contains layout information to display virtual representations of devices.
 *
 * Not to be confused with `DeviceConfig`/`SupportedDeviceConfig` (contains configuration
 * and override information) nor `DeviceLayout` (renders a virtual device using the
 * information in this class).
 */
export class VirtualDevice {
  /* Id of the device/port */
  readonly id: string;

  /* Device-reported name */
  readonly name: string;

  readonly type: 'normal' | 'adapter' | '5pin';

  /* Width (in inches) of device */
  readonly width: number;

  /* Height (in inches) of device */
  readonly height: number;

  /* See `DeviceStyle` */
  readonly style: DeviceStyle;

  /* See `KeyboardDriver` */
  readonly keyboard?: KeyboardDriver;

  /* See `VirtualInputGrid` */
  readonly inputGrids: VirtualInputGrid[];

  constructor(id: string, driver: DeviceDriver) {
    this.id = id;
    this.name = driver.name;
    this.width = driver.width;
    this.height = driver.height;
    this.style = driver.style;
    this.keyboard = driver.keyboard;
    this.type = driver.type;

    this.inputGrids = driver.inputGrids.map(
      (gridDriver: InputGridDriver) => new VirtualInputGrid(gridDriver)
    );
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
