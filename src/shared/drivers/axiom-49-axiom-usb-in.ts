import { DeviceDriver } from '../driver-types';
import {
  PadDriver,
  KnobDriver,
  NoninteractiveInputDriver,
  InputDriverWithHandle,
} from '../driver-types/input-drivers';

function createOctave(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 1,
    height: 1,
    type: 'pad',
    shape: 'rect',
  };
}

function createSlider(n: MidiNumber): InputDriverWithHandle {
  return {
    status: 'controlchange',
    channel: 0,
    number: n,
    type: 'slider',
    width: 0.5,
    height: 2,
    shape: 'rect',
    interactive: true,
    response: 'continuous',
    handleHeight: 0.625,
    handleWidth: 0.5,
    horizontal: false,
    inverted: false,
    availableColors: [],
    availableFx: [],
  };
}

function createButton(n: MidiNumber): PadDriver {
  return {
    status: 'controlchange',
    channel: 0,
    number: n,
    type: 'pad',
    width: 0.5,
    height: 0.5,
    shape: 'circle',
    interactive: true,
    response: 'toggle',
    availableColors: [],
    availableFx: [],
  };
}

function createMainButton(): NoninteractiveInputDriver {
  return {
    interactive: false,
    width: 0.625,
    height: 0.25,
    type: 'pad',
    shape: 'rect',
  };
}

function createTransport(
  n: MidiNumber,
  shape: 'circle' | 'rect' = 'rect'
): PadDriver {
  return {
    status: 'controlchange',
    channel: 15,
    number: n,
    type: 'pad',
    width: 0.5,
    height: 0.5,
    shape,
    interactive: true,
    response: 'gate',
    availableColors: [],
    availableFx: [],
  };
}

function createPad(n: MidiNumber): PadDriver {
  return {
    status: 'noteon/noteoff',
    channel: 9,
    number: n,
    type: 'pad',
    width: 1.125,
    height: 1.125,
    shape: 'rect',
    interactive: true,
    response: 'gate',
    availableColors: [],
    availableFx: [],
  };
}

function createKnob(n: MidiNumber): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    channel: 0,
    number: n,
    type: 'knob',
    width: 0.75,
    height: 0.75,
    shape: 'circle',
    response: 'continuous',
    availableColors: [],
    availableFx: [],
    knobType: 'absolute',
  };
}

export const Device: DeviceDriver = {
  name: 'Axiom 49 Axiom USB In',
  type: 'normal',
  anonymous: false,
  width: 31.5,
  height: 11.75,
  controlSequence: [],
  style: {
    borderTopLeftRadius: '0.1em',
    borderTopRightRadius: '0.1em',
    borderBottomLeftRadius: '0.1em',
    borderBottomRightRadius: '0.1em',
  },
  keyboard: {
    defaultOctave: 1,
    nOctaves: 4,
    channel: 1,
    width: 26.5,
    height: 5.5,
    left: 3.875,
    bottom: 0.5,
    enabled: true,
  },
  inputGrids: [
    {
      id: 'Wheels',
      nRows: 1,
      nCols: 2,
      width: 1.875,
      height: 2.25,
      left: 1,
      bottom: 2.5,
      inputs: [
        {
          status: 'pitchbend',
          channel: 0,
          number: 0,
          type: 'wheel',
          width: 0.5,
          height: 2.25,
          shape: 'rect',
          interactive: true,
          response: 'continuous',
          handleHeight: 0.5,
          handleWidth: 0.5,
          horizontal: false,
          inverted: false,
          availableColors: [],
          availableFx: [],
        },
        {
          status: 'controlchange',
          channel: 0,
          number: 1,
          type: 'wheel',
          width: 0.5,
          height: 2.25,
          shape: 'rect',
          interactive: true,
          response: 'continuous',
          handleHeight: 0.5,
          handleWidth: 0.5,
          horizontal: false,
          inverted: false,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Octaves',
      nRows: 1,
      nCols: 2,
      width: 2.25,
      height: 0.75,
      left: 0.75,
      bottom: 5.5,
      inputs: [createOctave(), createOctave()],
    },
    {
      id: 'Sliders',
      nRows: 1,
      nCols: 9,
      width: 8.375,
      height: 2,
      left: 3.75,
      bottom: 7.875,
      inputs: [
        createSlider(74),
        createSlider(71),
        createSlider(91),
        createSlider(93),
        createSlider(73),
        createSlider(3),
        createSlider(5),
        createSlider(84),
        createSlider(7),
      ],
    },
    {
      id: 'Buttons',
      nRows: 1,
      nCols: 9,
      width: 8.375,
      height: 0.5,
      left: 3.75,
      bottom: 6.875,
      inputs: [
        createButton(63),
        createButton(85),
        createButton(86),
        createButton(87),
        createButton(88),
        createButton(89),
        createButton(90),
        createButton(102),
        createButton(103),
      ],
    },
    {
      id: 'Main Buttons',
      nRows: 2,
      nCols: 6,
      width: 5,
      height: 1,
      left: 13.125,
      bottom: 6.75,
      inputs: [
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
        createMainButton(),
      ],
    },
    {
      id: 'Screen',
      nRows: 1,
      nCols: 1,
      width: 3.25,
      height: 1.875,
      left: 14,
      bottom: 8.175,
      inputs: [
        {
          interactive: false,
          width: 3.25,
          height: 1.875,
          type: 'pad',
          shape: 'rect',
        },
      ],
    },
    {
      id: 'Transport',
      nRows: 1,
      nCols: 6,
      width: 4.125,
      height: 0.5,
      left: 19.5,
      bottom: 7,
      inputs: [
        createTransport(113),
        createTransport(114),
        createTransport(115),
        createTransport(116),
        createTransport(117),
        createTransport(118, 'circle'),
      ],
    },
    {
      id: 'Pads',
      nRows: 2,
      nCols: 4,
      width: 5.625,
      height: 2.75,
      left: 24.625,
      bottom: 7,
      inputs: [
        createPad(84),
        createPad(81),
        createPad(79),
        createPad(85),
        createPad(72),
        createPad(74),
        createPad(78),
        createPad(82),
      ],
    },
    {
      id: 'Knobs Bottom',
      nRows: 1,
      nCols: 4,
      width: 4.25,
      height: 0.75,
      left: 19.5,
      bottom: 7.875,
      inputs: [createKnob(75), createKnob(76), createKnob(92), createKnob(95)],
    },
    {
      id: 'Knobs Top',
      nRows: 1,
      nCols: 4,
      width: 4.25,
      height: 0.75,
      left: 19,
      bottom: 8.75,
      inputs: [createKnob(10), createKnob(2), createKnob(18), createKnob(19)],
    },
  ],
};
