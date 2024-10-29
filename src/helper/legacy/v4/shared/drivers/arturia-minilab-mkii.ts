import { DeviceDriver, Color } from '../driver-types';
import {
  PadDriver,
  KnobDriver,
  NoninteractiveInputDriver,
} from '../driver-types/input-drivers';

function createKnob(
  n: MidiNumber,
  mode: 'endless' | 'absolute' = 'absolute',
): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    channel: 0,
    number: n,
    type: 'knob',
    width: 0.6,
    height: 0.6,
    knobType: mode,
    shape: 'circle',
    response: 'continuous',
    availableColors: [],
    availableFx: [],
  };
}

function createPadColors(n: MidiNumber): Color[] {
  return [
    {
      name: 'Off',
      string: 'transparent',
      default: true,
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 0, 247],
      effectable: false,
    },
    {
      name: 'Red',
      string: 'red',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 1, 247],
      effectable: false,
    },
    {
      name: 'Green',
      string: 'green',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 4, 247],
      effectable: false,
    },
    {
      name: 'Yellow',
      string: 'yellow',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 5, 247],
      effectable: false,
    },
    {
      name: 'Blue',
      string: 'blue',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 16, 247],
      effectable: false,
    },
    {
      name: 'Magenta',
      string: 'magenta',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 17, 247],
      effectable: false,
    },
    {
      name: 'Cyan',
      string: 'cyan',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 20, 247],
      effectable: false,
    },
    {
      name: 'White',
      string: 'white',
      array: [240, 0, 32, 107, 127, 66, 2, 0, 16, 112 + n, 127, 247],
      effectable: false,
    },
  ];
}

function createPad(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel: 9,
    number: n,
    type: 'pad',
    width: 0.875,
    height: 0.875,
    shape: 'rect',
    response: 'gate',
    availableColors: createPadColors((n - 36) as MidiNumber),
    availableFx: [],
  };
}

function createNoninteractive(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.65,
    height: 0.3,
    type: 'pad',
    shape: 'rect',
  };
}

export const Device: DeviceDriver = {
  name: 'Arturia MiniLab mkII',
  type: 'normal',
  anonymous: false,
  width: 13.875,
  height: 8.5,
  style: {},
  controlSequence: [],
  keyboard: {
    defaultOctave: 2,
    nOctaves: 2,
    channel: 1,
    width: 12.3,
    height: 3.5,
    left: 0.75,
    bottom: 0.375,
    enabled: true,
  },
  inputGrids: [
    {
      id: 'Knobs',
      nRows: 2,
      nCols: 8,
      width: 10.25,
      height: 2.25,
      bottom: 5.9,
      left: 3.25,
      inputs: [
        createKnob(112, 'endless'),
        createKnob(74),
        createKnob(71),
        createKnob(76),
        createKnob(77),
        createKnob(93),
        createKnob(73),
        createKnob(75),
        createKnob(114, 'endless'),
        createKnob(18),
        createKnob(19),
        createKnob(16),
        createKnob(17),
        createKnob(91),
        createKnob(79),
        createKnob(72),
      ],
    },
    {
      id: 'Pads',
      nRows: 1,
      nCols: 8,
      width: 10.25,
      height: 0.875,
      bottom: 4.75,
      left: 3.25,
      inputs: [
        createPad(36),
        createPad(37),
        createPad(38),
        createPad(39),
        createPad(40),
        createPad(41),
        createPad(42),
        createPad(43),
      ],
    },
    {
      id: 'Wheels',
      nRows: 1,
      nCols: 2,
      width: 2,
      height: 2.25,
      bottom: 4.375,
      left: 0.8,
      inputs: [
        {
          interactive: true,
          status: 'pitchbend',
          channel: 0,
          number: 0,
          type: 'wheel',
          width: 0.65,
          height: 2.25,
          shape: 'rect',
          response: 'continuous',
          handleWidth: 0.65,
          handleHeight: 0.65,
          horizontal: false,
          inverted: false,
          availableColors: [],
          availableFx: [],
        },
        {
          interactive: true,
          status: 'controlchange',
          channel: 0,
          number: 1,
          type: 'wheel',
          width: 0.65,
          height: 2.25,
          shape: 'rect',
          response: 'continuous',
          handleWidth: 0.65,
          handleHeight: 0.65,
          horizontal: false,
          inverted: false,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Meta Pads',
      nRows: 2,
      nCols: 2,
      width: 2,
      height: 1.2,
      bottom: 7,
      left: 0.8,
      inputs: [
        createNoninteractive(),
        createNoninteractive(),
        createNoninteractive(),
        createNoninteractive(),
      ],
    },
  ],
};
