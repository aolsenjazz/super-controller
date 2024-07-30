import { DeviceDriver, Color } from '../driver-types';
import {
  KnobDriver,
  PadDriver,
  NoninteractiveInputDriver,
} from '../driver-types/input-drivers';

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

function padColors(n: MidiNumber, useCC = false): Color[] {
  const status = useCC ? 176 : 144;
  return [
    {
      default: true,
      name: 'Off',
      string: 'transparent',
      array: [status, n, 0],
      effectable: false,
    },
    {
      name: 'Baby Blue (dim)',
      string: '#F3FAFE',
      array: [status, n, 1],
      effectable: false,
    },
    {
      name: 'Baby Blue',
      string: '#ECF7FD',
      array: [status, n, 2],
      effectable: false,
    },
    {
      name: 'Baby Blue (bright)',
      string: '#DFF9FF',
      array: [status, n, 3],
      effectable: false,
    },
    {
      name: 'Pink',
      string: '#FF9FDA',
      array: [status, n, 4],
      effectable: false,
    },
    {
      name: 'Red (dim)',
      string: '#F58A70',
      array: [status, n, 7],
      effectable: false,
    },
    {
      name: 'Red',
      string: '#F36E56',
      array: [status, n, 6],
      effectable: false,
    },
    {
      name: 'Red (bright)',
      string: '#F44336',
      array: [status, n, 5],
      effectable: false,
    },
    {
      name: 'White',
      string: 'white',
      array: [status, n, 8],
      effectable: false,
    },
    {
      name: 'Off-White',
      string: '#F8F0E3',
      array: [status, n, 12],
      effectable: false,
    },
    {
      name: 'Orange (dim)',
      string: '#FCBB6F',
      array: [status, n, 11],
      effectable: false,
    },
    {
      name: 'Orange',
      string: '#FAAB4B',
      array: [status, n, 10],
      effectable: false,
    },
    {
      name: 'Orange (bright)',
      string: '#FF9900',
      array: [status, n, 9],
      effectable: false,
    },
    {
      name: 'Yellow-Green (dim)',
      string: '#EBEEA0',
      array: [status, n, 15],
      effectable: false,
    },
    {
      name: 'Yellow-Green',
      string: '#E6EA89',
      array: [status, n, 14],
      effectable: false,
    },
    {
      name: 'Yellow-Green (Bright)',
      string: '#E3FF6A',
      array: [status, n, 13],
      effectable: false,
    },
    {
      name: 'SeaFoam-Green',
      string: '#93E9BE',
      array: [status, n, 16],
      effectable: false,
    },
    {
      name: 'Light Green (dim)',
      string: '#bfdfb0',
      array: [status, n, 19],
      effectable: false,
    },
    {
      name: 'Light Green',
      string: '#b0d89e',
      array: [status, n, 18],
      effectable: false,
    },
    {
      name: 'Light Green (bright)',
      string: '#90ee90',
      array: [status, n, 17],
      effectable: false,
    },
    {
      name: 'Blue-Green',
      string: '#7fffec',
      array: [status, n, 20],
      effectable: false,
    },
    {
      name: 'Green (dim)',
      string: '#91C587',
      array: [status, n, 23],
      effectable: false,
    },
    {
      name: 'Green',
      string: '#75BB6D',
      array: [status, n, 22],
      effectable: false,
    },
    {
      name: 'Green (bright)',
      string: '#4CAF50',
      array: [status, n, 21],
      effectable: false,
    },
    {
      name: 'Cyan (dim)',
      string: '#A5DDE7',
      array: [status, n, 31],
      effectable: false,
    },
    {
      name: 'Cyan',
      string: '#8ED5E3',
      array: [status, n, 30],
      effectable: false,
    },
    {
      name: 'Cyan (bright)',
      string: '#00FFFF',
      array: [status, n, 29],
      effectable: false,
    },
    {
      name: 'Light Blue (dim)',
      string: '#A0DDF9',
      array: [status, n, 35],
      effectable: false,
    },
    {
      name: 'Light Blue',
      string: '#86D5F7',
      array: [status, n, 34],
      effectable: false,
    },
    {
      name: 'Light Blue (bright)',
      string: '#55D3FF',
      array: [status, n, 33],
      effectable: false,
    },
    {
      name: 'Blue (dim)',
      string: '#A4CDED',
      array: [status, n, 39],
      effectable: false,
    },
    {
      name: 'Blue',
      string: '#8DC3EA',
      array: [status, n, 38],
      effectable: false,
    },
    {
      name: 'Blue (bright)',
      string: '#5FBCFF',
      array: [status, n, 37],
      effectable: false,
    },
    {
      name: 'Deep Blue (dim)',
      string: '#A3B7DF',
      array: [status, n, 43],
      effectable: false,
    },
    {
      name: 'Deep Blue',
      string: '#8FA9D8',
      array: [status, n, 44],
      effectable: false,
    },
    {
      name: 'Deep Blue (bright)',
      string: '#6AA0FF',
      array: [status, n, 45],
      effectable: false,
    },
    {
      name: 'Fuschia (dim)',
      string: '#d880b4',
      array: [status, n, 55],
      effectable: false,
    },
    {
      name: 'Fuschia',
      string: '#d161a5',
      array: [status, n, 54],
      effectable: false,
    },
    {
      name: 'Fuschia (bright)',
      string: '#ca2c92',
      array: [status, n, 53],
      effectable: false,
    },
  ];
}

function createPad(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.7,
    height: 0.7,
    shape: 'rect',
    response: 'gate',
    availableColors: padColors(n),
    availableFx: [],
  };
}

function createKnob(n: MidiNumber): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    number: n,
    channel: 15,
    response: 'continuous',
    type: 'knob',
    width: 0.375,
    height: 0.375,
    shape: 'circle',
    knobType: 'absolute',
    availableColors: [],
    availableFx: [],
  };
}

function createTransport(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'controlchange',
    channel: 15,
    number: n,
    type: 'pad',
    width: 0.5,
    height: 0.25,
    shape: 'rect',
    response: 'gate',
    availableColors: [
      {
        default: true,
        name: 'Off',
        string: 'transparent',
        array: [191, n, 0],
        effectable: false,
      },
      {
        name: 'White (dim)',
        string: 'rgba(255,255,255,0.5)',
        array: [191, n, 1],
        effectable: false,
      },
      {
        name: 'White',
        string: 'white',
        array: [191, n, 127],
        effectable: false,
      },
    ],
    availableFx: [],
  };
}

export const Device: DeviceDriver = {
  name: 'Launchkey Mini MK3 DAW Port',
  type: 'normal',
  anonymous: false,
  width: 13,
  height: 6.75,
  style: {
    borderTopLeftRadius: '0.5em',
    borderTopRightRadius: '0.5em',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  keyboard: {
    defaultOctave: 2,
    nOctaves: 2,
    channel: 0,
    width: 11.625,
    height: 3.125,
    left: 0.625,
    bottom: 0,
    enabled: false,
  },
  controlSequence: [
    [128, 96, 0],
    [128, 97, 0],
    [128, 98, 0],
    [128, 99, 0],
    [128, 100, 0],
    [128, 101, 0],
    [128, 102, 0],
    [128, 103, 0],
    [128, 112, 0],
    [128, 113, 0],
    [128, 114, 0],
    [128, 115, 0],
    [128, 116, 0],
    [128, 117, 0],
    [128, 118, 0],
    [128, 119, 0],
    [176, 104, 0],
    [191, 103, 0],
    [191, 102, 63],
    [191, 115, 0],
    [191, 117, 0],
    [176, 105, 1],
    [191, 21, 108],
    [191, 22, 108],
    [191, 23, 108],
    [191, 24, 108],
    [191, 21, 108],
    [191, 22, 108],
    [191, 23, 108],
    [191, 24, 108],
    [191, 3, 1],
    [176, 105, 0],
    [191, 102, 0],
    [176, 108, 0],
    [137, 48, 0],
    [137, 49, 0],
    [137, 50, 0],
    [137, 51, 0],
    [137, 44, 0],
    [137, 45, 0],
    [137, 46, 0],
    [137, 47, 0],
    [137, 40, 0],
    [137, 41, 0],
    [137, 42, 0],
    [137, 43, 0],
    [137, 36, 0],
    [137, 37, 0],
    [137, 38, 0],
    [137, 39, 0],
    [143, 12, 0],
    [191, 3, 0],
    [191, 9, 0],
    [128, 96, 0],
    [128, 97, 0],
    [128, 98, 0],
    [128, 99, 0],
    [128, 100, 0],
    [128, 101, 0],
    [128, 102, 0],
    [128, 103, 0],
    [128, 112, 0],
    [128, 113, 0],
    [128, 114, 0],
    [128, 115, 0],
    [128, 116, 0],
    [128, 117, 0],
    [128, 118, 0],
    [128, 119, 0],
    [176, 104, 0],
    [191, 103, 0],
    [191, 102, 63],
    [191, 115, 0],
    [191, 117, 0],
    [191, 21, 108],
    [191, 22, 108],
    [191, 23, 108],
    [191, 24, 108],
    [191, 21, 108],
    [191, 22, 108],
    [191, 23, 108],
    [191, 24, 108],
    [159, 12, 127],
    [191, 3, 2],
    [191, 9, 1],
    [176, 104, 0],
  ],
  inputGrids: [
    {
      id: 'Wheels',
      nRows: 1,
      nCols: 2,
      width: 1.25,
      height: 2.25,
      left: 0.6,
      bottom: 3.875,
      inputs: [
        {
          interactive: false,
          type: 'wheel',
          width: 0.5,
          height: 2.25,
          shape: 'rect',
          handleWidth: 0.5,
          handleHeight: 0.25,
        },
        {
          interactive: false,
          type: 'wheel',
          width: 0.5,
          height: 2.25,
          shape: 'rect',
          handleWidth: 0.5,
          handleHeight: 0.25,
        },
      ],
    },
    {
      id: 'Octaves',
      nRows: 2,
      nCols: 1,
      width: 0.5,
      height: 0.75,
      left: 2.25,
      bottom: 3.75,
      inputs: [
        createNoninteractivePad(0.5, 0.25),
        createNoninteractivePad(0.5, 0.25),
      ],
    },
    {
      id: 'Transpose',
      nRows: 1,
      nCols: 1,
      width: 0.5,
      height: 0.25,
      left: 2.25,
      bottom: 5.125,
      inputs: [createNoninteractivePad(0.5, 0.25)],
    },
    {
      id: 'Shift',
      nRows: 1,
      nCols: 1,
      width: 0.5,
      height: 0.25,
      left: 2.25,
      bottom: 5.875,
      inputs: [createNoninteractivePad(0.5, 0.25)],
    },
    {
      id: 'Pads',
      nRows: 2,
      nCols: 9,
      width: 7.625,
      height: 1.6,
      left: 3.125,
      bottom: 3.75,
      inputs: [
        createPad(96),
        createPad(97),
        createPad(98),
        createPad(99),
        createPad(100),
        createPad(101),
        createPad(102),
        createPad(103),
        {
          interactive: true,
          status: 'controlchange',
          channel: 0,
          number: 104,
          type: 'pad',
          width: 0.7,
          height: 0.7,
          shape: 'rect',
          response: 'gate',
          availableColors: padColors(104, true),
          availableFx: [],
        },
        createPad(112),
        createPad(113),
        createPad(114),
        createPad(115),
        createPad(116),
        createPad(117),
        createPad(118),
        createPad(119),
        {
          interactive: true,
          status: 'controlchange',
          channel: 0,
          number: 105,
          type: 'pad',
          width: 0.7,
          height: 0.7,
          shape: 'rect',
          response: 'gate',
          availableColors: padColors(105, true),
          availableFx: [],
        },
      ],
    },
    {
      id: 'Knobs',
      nRows: 1,
      nCols: 8,
      width: 6.375,
      height: 0.375,
      left: 3.25,
      bottom: 6,
      inputs: [
        createKnob(21),
        createKnob(22),
        createKnob(23),
        createKnob(24),
        createKnob(25),
        createKnob(26),
        createKnob(27),
        createKnob(28),
      ],
    },
    {
      id: 'Transport',
      nRows: 1,
      nCols: 2,
      width: 1.25,
      height: 0.25,
      left: 11.125,
      bottom: 3.75,
      inputs: [createTransport(115), createTransport(117)],
    },
    {
      id: 'Track',
      nRows: 1,
      nCols: 2,
      width: 1.25,
      height: 0.25,
      left: 11.125,
      bottom: 4.625,
      inputs: [
        createNoninteractivePad(0.5, 0.25),
        createNoninteractivePad(0.5, 0.25),
      ],
    },
  ],
};
