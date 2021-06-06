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

  readonly aspectRatio: string;

  readonly style: DeviceStyle;

  readonly keyboard?: KeyboardDriver;

  readonly inputGrids: VirtualInputGrid[];

  constructor(id: string, driver: DeviceDriver) {
    this.id = id;
    this.name = driver.name;
    this.aspectRatio = driver.aspectRatio;
    this.style = driver.style;
    this.keyboard = driver.keyboard;

    this.inputGrids = driver.inputGrids.map(
      (gridDriver: InputGridDriver) => new VirtualInputGrid(gridDriver)
    );
  }
}
