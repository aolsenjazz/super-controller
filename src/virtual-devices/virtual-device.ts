import { VirtualInputGrid } from './virtual-input-grid';
import {
  KeyboardDriver,
  DeviceStyle,
  DeviceDriver,
  InputGridDriver,
} from '../driver-types';

export class VirtualDevice {
  readonly id: string;

  readonly name: string;

  readonly width: number;

  readonly height: number;

  readonly style: DeviceStyle;

  readonly keyboard?: KeyboardDriver;

  readonly inputGrids: VirtualInputGrid[];

  constructor(id: string, driver: DeviceDriver) {
    this.id = id;
    this.name = driver.name;
    this.width = driver.width;
    this.height = driver.height;
    this.style = driver.style;
    this.keyboard = driver.keyboard;

    this.inputGrids = driver.inputGrids.map(
      (gridDriver: InputGridDriver) => new VirtualInputGrid(gridDriver)
    );
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
