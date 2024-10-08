import { KnobDriver } from '../driver-types/input-drivers/knob-driver';
import { PadDriver } from '../driver-types/input-drivers/pad-driver';
import { DeviceDriver } from '../driver-types/device-driver';
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

function createSquarePad(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 1,
    height: 1,
    availableColors: [],
    availableFx: [],
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

export const Device: DeviceDriver = {
  name: 'MPK mini 3',
  type: 'normal',
  anonymous: false,
  width: 12.5,
  height: 6.875,
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
    channel: 0,
    width: 11.375,
    height: 3.125,
    left: 0.5,
    bottom: 0,
    enabled: true,
  },
  inputGrids: [
    {
      id: 'XY',
      height: 0.9,
      width: 0.9,
      left: 0.625,
      bottom: 5.6,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          type: 'xy',
          interactive: true,
          shape: 'circle',
          height: 0.9,
          width: 0.9,
          x: {
            status: 'pitchbend',
            channel: 0,
            number: 0,
            type: 'slider',
            width: 0.9,
            height: 0.9,
            shape: 'circle',
            interactive: true,
            response: 'continuous',
            handleWidth: 0.5,
            handleHeight: 0.5,
            horizontal: false,
            inverted: false,
            availableColors: [],
            availableFx: [],
          },
          y: {
            status: 'controlchange',
            channel: 0,
            number: 1,
            type: 'slider',
            width: 0.9,
            height: 0.9,
            shape: 'circle',
            interactive: true,
            response: 'continuous',
            handleWidth: 0.5,
            handleHeight: 0.5,
            horizontal: false,
            inverted: false,
            availableColors: [],
            availableFx: [],
          },
        },
      ],
    },
    {
      id: 'Arpeggiator',
      height: 1.25,
      width: 1.25,
      left: 0.4,
      bottom: 3.875,
      nRows: 3,
      nCols: 2,
      inputs: [
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
      ],
    },
    {
      id: 'Pads',
      height: 2.5,
      width: 5.125,
      bottom: 3.875,
      left: 2.125,
      nRows: 2,
      nCols: 4,
      inputs: [
        createSquarePad(40),
        createSquarePad(41),
        createSquarePad(42),
        createSquarePad(43),
        createSquarePad(36),
        createSquarePad(37),
        createSquarePad(38),
        createSquarePad(39),
      ],
    },
    {
      id: 'Knobs',
      height: 2.125,
      width: 4.5,
      bottom: 3.625,
      left: 7.625,
      nRows: 2,
      nCols: 4,
      inputs: [
        createKnob(70),
        createKnob(71),
        createKnob(72),
        createKnob(73),
        createKnob(74),
        createKnob(75),
        createKnob(76),
        createKnob(77),
      ],
    },
    {
      id: 'PAD CONTROLS',
      height: 0.375,
      width: 2.625,
      bottom: 6,
      left: 9.25,
      nRows: 1,
      nCols: 4,
      inputs: [
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
        createNoninteractivePad(0.5, 0.375),
      ],
    },
    {
      id: 'Screen',
      height: 0.625,
      width: 1.375,
      left: 7.625,
      bottom: 5.875,
      nRows: 1,
      nCols: 1,
      inputs: [createNoninteractivePad(1.375, 0.625)],
    },
  ],
};
