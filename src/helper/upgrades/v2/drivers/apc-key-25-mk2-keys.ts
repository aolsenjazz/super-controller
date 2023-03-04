import { DeviceDriver } from '../driver-types';
import { NoninteractiveInputDriver } from '../driver-types/input-drivers';

function createMainPad(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.5,
    height: 0.3,
    type: 'pad',
    shape: 'rect',
    style: {},
  };
}

function createSquarePad(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.25,
    height: 0.25,
    type: 'pad',
    shape: 'rect',
    style: {},
  };
}

function createVertPad(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.25,
    height: 0.25,
    type: 'pad',
    shape: 'rect',
    style: {},
  };
}

function createKnob(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.5,
    height: 0.5,
    type: 'knob',
    shape: 'circle',
    style: {},
  };
}

export const Device: DeviceDriver = {
  type: 'normal',
  name: 'APC Key 25 mk2 Keys',
  anonymous: false,
  height: 7.5,
  width: 12.125,
  controlSequence: [],
  style: {},
  keyboard: {
    defaultOctave: 2,
    nOctaves: 2,
    channel: 1,
    width: 11.5,
    height: 3.125,
    left: 0.3125,
    bottom: 0,
    enabled: false,
  },
  inputGrids: [
    {
      id: 'MainPads',
      height: 3.75,
      width: 6.375,
      left: 0.375,
      bottom: 3.5,
      nRows: 6,
      nCols: 8,
      inputs: [
        ...Array(40).fill(createMainPad()),
        ...Array(8).fill(createSquarePad()),
      ],
    },
    {
      id: 'VertCircles',
      height: 3.75,
      width: 0.5,
      left: 6.85,
      bottom: 3.5,
      nRows: 6,
      nCols: 1,
      inputs: Array(6).fill(createVertPad()),
    },
    {
      id: 'Knobs',
      height: 2.25,
      width: 4.25,
      bottom: 5,
      left: 7.45,
      nRows: 2,
      nCols: 4,
      inputs: Array(8).fill(createKnob()),
    },
    {
      id: 'Aux1',
      height: 1.25,
      width: 4,
      left: 7.625,
      bottom: 3.5,
      nRows: 2,
      nCols: 5,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          channel: 0,
          number: 64,
          response: 'gate',
          shape: 'rect',
          type: 'pad',
          width: 0.5,
          height: 0.3,
          style: {},
          availableColors: [],
          availableFx: [],
        },
        ...Array(5).fill(createMainPad()),
      ],
    },
  ],
};
