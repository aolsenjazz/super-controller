import { DeviceDriver } from '../driver-types';
import { NoninteractiveInputDriver } from '../driver-types/input-drivers';

function defaultPad(): NoninteractiveInputDriver {
  return {
    type: 'pad',
    width: 1,
    height: 1,
    shape: 'rect',
    interactive: false,
    style: {},
  };
}

export const Device: DeviceDriver = {
  name: 'Anonymous',
  type: 'normal',
  anonymous: true,
  width: 12,
  height: 6,
  controlSequence: [],
  style: {},
  keyboard: {
    defaultOctave: 0,
    nOctaves: 1,
    channel: 0,
    width: 12,
    height: 4,
    bottom: 0,
    left: 0,
    enabled: false,
  },
  inputGrids: [
    {
      id: 'MainPads',
      nRows: 1,
      nCols: 6,
      width: 12,
      height: 2,
      bottom: 4,
      left: 0,
      inputs: [
        defaultPad(),
        defaultPad(),
        defaultPad(),
        defaultPad(),
        defaultPad(),
        defaultPad(),
      ],
    },
  ],
};
