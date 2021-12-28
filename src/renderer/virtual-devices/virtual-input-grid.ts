import { VirtualInput } from './virtual-input';
import { InputGridDriver } from '../../driver-types';

/**
 * Contains layout information to display a virtual representation of an input grid.
 *
 * `InputGrid`s are rectangular groups of inputs that, physically appear to be in
 * a coherent group.
 *
 * Should not be confused with `InputGridLayout`, the React component which renders
 * the virtual controller using the information in this class.
 */
export class VirtualInputGrid {
  /* Id for InputGrid. Can be any arbitrary value */
  readonly id: string;

  /* Height (in inches) of input grid */
  readonly height: number;

  /* Width (in inches) of input grid */
  readonly width: number;

  /* Distance (in inches) from left edge of device */
  readonly left: number;

  /* Distance (in inches) from bottom edge of device */
  readonly bottom: number;

  /* Number of columns of inputs */
  readonly nCols: number;

  /* Number of rows of inputs */
  readonly nRows: number;

  /* See `VirtualInput` */
  readonly inputs: VirtualInput[] = [];

  constructor(driver: InputGridDriver) {
    this.id = driver.id;
    this.height = driver.height;
    this.width = driver.width;
    this.nRows = driver.nRows;
    this.nCols = driver.nCols;
    this.left = driver.left;
    this.bottom = driver.bottom;

    this.inputs = driver.inputs.map((d) => new VirtualInput(d));
  }

  /**
   * Some inputs represent multiple inputs. E.g. an XY pad can have an input
   * bound to both its X and Y axes
   */
  get isMultiInput() {
    const xyInputs = this.inputs.filter((input) => input.type === 'xy');
    return xyInputs.length > 0;
  }
}
