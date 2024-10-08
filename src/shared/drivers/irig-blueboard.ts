import { PadDriver } from '../driver-types/input-drivers/pad-driver';
import { DeviceDriver } from '../driver-types/device-driver';

function createPad(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'controlchange',
    channel: 0,
    number: n,
    type: 'pad',
    width: 1,
    height: 1,
    shape: 'rect',
    response: 'toggle',
    availableColors: [],
    availableFx: [],
  };
}

export const Device: DeviceDriver = {
  name: 'iRig BlueBoard',
  type: 'normal',
  anonymous: false,
  width: 10.75,
  height: 3.5,
  controlSequence: [],
  style: {
    borderTopLeftRadius: '0.5em',
    borderTopRightRadius: '0.5em',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  inputGrids: [
    {
      id: 'Squares',
      nRows: 1,
      nCols: 4,
      width: 11.75,
      height: 1,
      left: -0.5,
      bottom: 0.75,
      inputs: [createPad(0), createPad(1), createPad(2), createPad(3)],
    },
  ],
};
