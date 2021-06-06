import { VirtualInput } from './virtual-input';
import { InputGridStyle, InputGridDriver } from '../driver-types';

export class VirtualInputGrid {
  readonly id: string;

  readonly height: number;

  readonly width: number;

  readonly nCols: number;

  readonly nRows: number;

  readonly inputs: VirtualInput[] = [];

  readonly style: InputGridStyle;

  constructor(driver: InputGridDriver) {
    this.id = driver.id;
    this.height = driver.height;
    this.width = driver.width;
    this.style = driver.style;
    this.nRows = driver.nRows;
    this.nCols = driver.nCols;

    this.inputs = driver.inputs.map((d) => VirtualInput.fromDriver(d));
  }
}
