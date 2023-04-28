import { DeviceDriver } from '../driver-types';
import {
  PadDriver,
  InputDriverWithHandle,
  KnobDriver,
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

function createNoninteractiveKnob(
  width: number,
  height: number
): NoninteractiveInputDriver {
  return {
    interactive: false,
    width,
    height,
    type: 'knob',
    shape: 'circle',
  };
}

function createKnob(n: MidiNumber): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    number: n,
    channel: 0,
    response: 'continuous',
    type: 'knob',
    width: 0.5,
    height: 0.5,
    shape: 'circle',
    knobType: 'absolute',
    availableColors: [],
    availableFx: [],
  };
}

function createSmallOrangeButton(
  n: MidiNumber,
  colorNumber?: MidiNumber
): PadDriver {
  return {
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.3,
    height: 0.3,
    shape: 'rect',
    interactive: true,
    response: 'gate',
    availableColors: [
      {
        name: 'Off',
        default: true,
        string: 'transparent',
        array: [176, colorNumber || n, 0],
        effectable: false,
      },
      {
        name: 'Orange',
        string: '#F57C00',
        array: [176, colorNumber || n, 1],
        effectable: false,
      },
    ],
    availableFx: [],
  };
}

function createSmallBlueButton(
  n: MidiNumber,
  colorNumber?: MidiNumber
): PadDriver {
  const b = createSmallOrangeButton(n, colorNumber);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (b as any).availableColors = [
    {
      name: 'Off',
      default: true,
      string: 'transparent',
      array: [176, colorNumber || n, 0],
    },
    {
      name: 'Blue',
      string: '#2196F3',
      array: [176, colorNumber || n, 1],
    },
  ];

  return b;
}

function createLargeOrangeButton(
  n: MidiNumber,
  colorNumber?: MidiNumber
): PadDriver {
  return {
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.6,
    height: 0.4,
    shape: 'rect',
    interactive: true,
    response: 'gate',
    availableColors: [
      {
        name: 'Off',
        default: true,
        string: 'transparent',
        array: [176, colorNumber || n, 0],
        effectable: false,
      },
      {
        name: 'Orange',
        string: '#F57C00',
        array: [176, colorNumber || n, 1],
        effectable: false,
      },
    ],
    availableFx: [],
  };
}

function createLargeBlueButton(
  n: MidiNumber,
  colorNumber?: MidiNumber
): PadDriver {
  const b = createLargeOrangeButton(n, colorNumber);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (b as any).availableColors = [
    {
      name: 'Off',
      default: true,
      string: 'transparent',
      array: [176, colorNumber || n, 0],
    },
    {
      name: 'Blue',
      string: '#2196F3',
      array: [176, colorNumber || n, 1],
    },
  ];

  return b;
}

function createSmallColorlessButton(n: MidiNumber): PadDriver {
  return {
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.3,
    height: 0.3,
    shape: 'rect',
    interactive: true,
    response: 'gate',
    availableColors: [],
    availableFx: [],
  };
}

function createTinyButton(n: MidiNumber): PadDriver {
  return {
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.2,
    height: 0.2,
    shape: 'circle',
    interactive: true,
    response: 'gate',
    availableColors: [],
    availableFx: [],
  };
}

function createSlider(n: MidiNumber): InputDriverWithHandle {
  return {
    interactive: true,
    status: 'controlchange',
    number: n,
    channel: 0,
    response: 'continuous',
    type: 'slider',
    width: 0.75,
    height: 2.1,
    shape: 'rect',
    handleWidth: 0.75,
    handleHeight: 0.25,
    horizontal: false,
    inverted: false,
    availableColors: [],
    availableFx: [],
  };
}

export const Device: DeviceDriver = {
  name: 'DDM4000',
  type: '5pin',
  anonymous: false,
  width: 12.5,
  height: 15.5,
  controlSequence: [],
  throttle: 300,
  style: {
    borderBottomLeftRadius: '0.5em',
    borderTopLeftRadius: '0.5em',
    borderTopRightRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  inputGrids: [
    {
      id: 'MIC Knobs',
      nRows: 4,
      nCols: 1,
      width: 0.5,
      height: 4.5,
      bottom: 9.875,
      left: 0.65,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createKnob(0),
        createKnob(1),
        createKnob(2),
      ],
    },
    {
      id: 'CH-1 Knobs',
      nRows: 4,
      nCols: 1,
      width: 0.5,
      height: 4.5,
      bottom: 9.875,
      left: 2.55,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createKnob(4),
        createKnob(5),
        createKnob(6),
      ],
    },
    {
      id: 'CH-2 Knobs',
      nRows: 4,
      nCols: 1,
      width: 0.5,
      height: 4.5,
      bottom: 9.875,
      left: 4.45,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createKnob(8),
        createKnob(9),
        createKnob(10),
      ],
    },
    {
      id: 'CH-3 Knobs',
      nRows: 4,
      nCols: 1,
      width: 0.5,
      height: 4.5,
      bottom: 9.875,
      left: 6.35,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createKnob(12),
        createKnob(13),
        createKnob(14),
      ],
    },
    {
      id: 'CH-4 Knobs',
      nRows: 4,
      nCols: 1,
      width: 0.5,
      height: 4.5,
      bottom: 9.875,
      left: 8.25,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createKnob(16),
        createKnob(17),
        createKnob(18),
      ],
    },
    {
      id: 'MIC Buttons',
      nRows: 4,
      nCols: 1,
      width: 0.3,
      height: 2.375,
      bottom: 10.3,
      left: 1.7,
      inputs: [
        createSmallOrangeButton(49),
        createSmallOrangeButton(50),
        createSmallOrangeButton(51),
        createSmallOrangeButton(52),
      ],
    },
    {
      id: 'CH-1 Buttons',
      nRows: 4,
      nCols: 1,
      width: 0.3,
      height: 2.375,
      bottom: 10.3,
      left: 3.6,
      inputs: [
        createSmallColorlessButton(3),
        createSmallOrangeButton(0, 57),
        createSmallOrangeButton(1, 59),
        createSmallOrangeButton(2, 61),
      ],
    },
    {
      id: 'CH-2 Buttons',
      nRows: 4,
      nCols: 1,
      width: 0.3,
      height: 2.375,
      bottom: 10.3,
      left: 5.5,
      inputs: [
        createSmallColorlessButton(7),
        createSmallOrangeButton(4, 67),
        createSmallOrangeButton(5, 69),
        createSmallOrangeButton(6, 71),
      ],
    },
    {
      id: 'CH-3 Buttons',
      nRows: 4,
      nCols: 1,
      width: 0.3,
      height: 2.375,
      bottom: 10.3,
      left: 7.4,
      inputs: [
        createSmallColorlessButton(11),
        createSmallOrangeButton(8, 77),
        createSmallOrangeButton(9, 79),
        createSmallOrangeButton(10, 81),
      ],
    },
    {
      id: 'CH-4 Buttons',
      nRows: 4,
      nCols: 1,
      width: 0.3,
      height: 2.375,
      bottom: 10.3,
      left: 9.3,
      inputs: [
        createSmallColorlessButton(15),
        createSmallOrangeButton(12, 87),
        createSmallOrangeButton(13, 89),
        createSmallOrangeButton(14, 91),
      ],
    },
    {
      id: 'Output Knobs',
      nRows: 3,
      nCols: 1,
      width: 0.5,
      height: 3.25,
      bottom: 10.875,
      left: 11.25,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
      ],
    },
    {
      id: 'Phones Knobs',
      nRows: 2,
      nCols: 1,
      width: 0.5,
      height: 1.75,
      bottom: 6.5,
      left: 11.25,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
      ],
    },
    {
      id: 'Output Buttons',
      nRows: 1,
      nCols: 2,
      width: 2,
      height: 0.6,
      bottom: 9.875,
      left: 10.125,
      inputs: [
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
      ],
    },
    {
      id: 'Crossfader Buttons',
      nRows: 1,
      nCols: 2,
      width: 2,
      height: 0.6,
      bottom: 3,
      left: 10.125,
      inputs: [createLargeOrangeButton(40), createLargeOrangeButton(41)],
    },
    {
      id: 'Midi Bounce Click Button',
      nRows: 1,
      nCols: 1,
      width: 2,
      height: 0.6,
      bottom: 3.7,
      left: 10.125,
      inputs: [createLargeOrangeButton(42)],
    },
    {
      id: 'Phones buttons',
      nRows: 3,
      nCols: 1,
      width: 0.6,
      height: 2.1,
      bottom: 6.125,
      left: 10.125,
      inputs: [
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
      ],
    },
    {
      id: 'Screen',
      nRows: 1,
      nCols: 1,
      width: 5.75,
      height: 0.875,
      bottom: 8.5,
      left: 3.25,
      inputs: [createNoninteractivePad(5.75, 0.875)],
    },
    {
      id: 'Mic On/Off',
      nRows: 1,
      nCols: 1,
      width: 0.6,
      height: 0.4,
      bottom: 8.875,
      left: 1.125,
      inputs: [createLargeOrangeButton(53)],
    },
    {
      id: 'A low-mid-high',
      nRows: 3,
      nCols: 1,
      width: 0.3,
      height: 2.15,
      bottom: 0.625,
      left: 2.5,
      inputs: [
        createSmallOrangeButton(24),
        createSmallOrangeButton(25),
        createSmallOrangeButton(26),
      ],
    },
    {
      id: 'B low-mid-high',
      nRows: 3,
      nCols: 1,
      width: 0.3,
      height: 2.15,
      bottom: 0.625,
      left: 9.25,
      inputs: [
        createSmallOrangeButton(28),
        createSmallOrangeButton(29),
        createSmallOrangeButton(30),
      ],
    },
    {
      id: 'Full freq A',
      nRows: 1,
      nCols: 1,
      width: 0.3,
      height: 0.3,
      bottom: 2.25,
      left: 3.25,
      inputs: [createSmallOrangeButton(23)],
    },
    {
      id: 'Full freq B',
      nRows: 1,
      nCols: 1,
      width: 0.3,
      height: 0.3,
      bottom: 2.25,
      left: 8.5,
      inputs: [createSmallOrangeButton(27)],
    },
    {
      id: 'Volume Mix Knob',
      nRows: 1,
      nCols: 1,
      width: 0.5,
      height: 0.5,
      bottom: 7.375,
      left: 0.75,
      inputs: [createKnob(3)],
    },
    {
      id: 'Insert button',
      nRows: 1,
      nCols: 1,
      width: 0.3,
      height: 0.3,
      bottom: 7.4,
      left: 1.75,
      inputs: [createSmallOrangeButton(95)],
    },
    {
      id: 'CF ON',
      nRows: 1,
      nCols: 1,
      width: 0.3,
      height: 0.3,
      bottom: 2.25,
      left: 5.9,
      inputs: [createSmallBlueButton(31)],
    },
    {
      id: 'Mic small buttons',
      nRows: 2,
      nCols: 2,
      width: 1.6,
      height: 3.25,
      bottom: 4,
      left: 0.5,
      inputs: [
        createTinyButton(97),
        createTinyButton(96),
        createTinyButton(104),
        createTinyButton(103),
      ],
    },
    {
      id: 'Main faders',
      nRows: 1,
      nCols: 4,
      width: 7.4,
      height: 2.1,
      bottom: 3,
      left: 2,
      inputs: [
        createSlider(7),
        createSlider(11),
        createSlider(15),
        createSlider(19),
      ],
    },
    {
      id: 'Transport small buttons',
      nRows: 5,
      nCols: 1,
      width: 0.3,
      height: 3.625,
      bottom: 0.625,
      left: 1.875,
      inputs: [
        createSmallColorlessButton(108),
        createSmallOrangeButton(113),
        createSmallOrangeButton(118),
        createSmallOrangeButton(121),
        createSmallOrangeButton(124),
      ],
    },
    {
      id: 'CF Assign Buttons',
      nRows: 1,
      nCols: 4,
      width: 7.5,
      height: 0.2,
      bottom: 3,
      left: 2.85,
      inputs: [
        createTinyButton(32),
        createTinyButton(34),
        createTinyButton(36),
        createTinyButton(38),
      ],
    },
    {
      id: 'Beat Buttons',
      nRows: 1,
      nCols: 2,
      width: 1.5,
      height: 0.2,
      bottom: 4.5,
      left: 10.375,
      inputs: [createTinyButton(43), createTinyButton(44)],
    },
    {
      id: 'Curve Knob',
      nRows: 1,
      nCols: 1,
      width: 0.3,
      height: 0.3,
      bottom: 2.35,
      left: 10.925,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 20,
          channel: 0,
          response: 'continuous',
          type: 'knob',
          width: 0.3,
          height: 0.3,
          shape: 'circle',
          knobType: 'absolute',
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'PFL buttons',
      nRows: 1,
      nCols: 5,
      width: 9.25,
      height: 0.4,
      bottom: 5.5,
      left: 0.125,
      inputs: [
        createLargeBlueButton(102),
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.6, 0.4),
      ],
    },
    {
      id: 'Transport big buttons',
      nRows: 5,
      nCols: 1,
      width: 0.6,
      height: 3.625,
      bottom: 0.625,
      left: 0.75,
      inputs: [
        createLargeBlueButton(109),
        createLargeOrangeButton(110),
        createLargeOrangeButton(115),
        createLargeOrangeButton(120),
        createTinyButton(122),
      ],
    },
    {
      id: 'Crossfader',
      nRows: 1,
      nCols: 1,
      width: 2.25,
      height: 0.75,
      bottom: 0,
      left: 5.625,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 21,
          channel: 0,
          response: 'continuous',
          type: 'slider',
          width: 2.25,
          height: 0.75,
          shape: 'rect',
          handleWidth: 0.25,
          handleHeight: 0.75,
          horizontal: true,
          inverted: false,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Misc 1',
      nRows: 1,
      nCols: 5,
      width: 6,
      height: 0.4,
      bottom: 6.7,
      left: 3.15,
      inputs: [
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.6, 0.4),
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.6, 0.4),
      ],
    },
    {
      id: 'Misc 2',
      nRows: 1,
      nCols: 3,
      width: 1.375,
      height: 0.3,
      bottom: 7.625,
      left: 3.75,
      inputs: [
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.3, 0.3),
      ],
    },
    {
      id: 'Misc 3',
      nRows: 1,
      nCols: 3,
      width: 1.375,
      height: 0.3,
      bottom: 7.625,
      left: 6.875,
      inputs: [
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.3, 0.3),
        createNoninteractivePad(0.3, 0.3),
      ],
    },
  ],
};
