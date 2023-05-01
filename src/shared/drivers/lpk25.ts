import { DeviceDriver } from '../driver-types';
import { NoninteractiveInputDriver } from '../driver-types/input-drivers';

function createNoninteractivePad(
  width: number,
  height: number
): NoninteractiveInputDriver {
  return {
    interactive: false,
    width,
    height,
    type: 'pad',
    shape: 'rect',
  };
}

export const Device: DeviceDriver = {
  name: 'LPK25',
  type: 'normal',
  anonymous: false,
  width: 13.25,
  height: 3.75,
  controlSequence: [],
  style: {
    borderTopLeftRadius: '0.5em',
    borderTopRightRadius: '0.5em',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  keyboard: {
    defaultOctave: 2,
    nOctaves: 2,
    channel: 1,
    width: 11.5,
    height: 3.125,
    bottom: 0,
    left: 1.5,
    enabled: true,
  },
  inputGrids: [
    {
      id: 'Pads',
      height: 1.5,
      width: 1.05,
      left: 0.2,
      bottom: 0.125,
      nRows: 3,
      nCols: 2,
      inputs: [
        createNoninteractivePad(0.3125, 0.3125),
        createNoninteractivePad(0.3125, 0.3125),
        createNoninteractivePad(0.3125, 0.3125),
        createNoninteractivePad(0.3125, 0.3125),
        createNoninteractivePad(0.3125, 0.3125),
        createNoninteractivePad(0.3125, 0.3125),
      ],
    },
  ],
};
