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
    style: {},
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
    style: {},
  };
}

export const Device: DeviceDriver = {
  name: 'Launchkey Mini LK Mini MIDI',
  type: 'normal',
  anonymous: false,
  width: 12.75,
  height: 6.75,
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
    width: 11.625,
    height: 3.125,
    left: 0.5,
    bottom: 0,
    enabled: false,
  },
  inputGrids: [
    {
      id: 'Octave/Track',
      nRows: 2,
      nCols: 2,
      width: 1.25,
      height: 1.75,
      left: 0.55,
      bottom: 3.75,
      inputs: [
        createNoninteractivePad(0.5, 0.3),
        createNoninteractivePad(0.5, 0.3),
        createNoninteractivePad(0.5, 0.3),
        createNoninteractivePad(0.5, 0.3),
      ],
    },
    {
      id: 'MIDI Channel',
      nRows: 1,
      nCols: 1,
      width: 0.375,
      height: 0.375,
      left: 2.125,
      bottom: 4.875,
      inputs: [createNoninteractivePad(0.375, 0.375)],
    },
    {
      id: 'Main Pads',
      nRows: 2,
      nCols: 8,
      width: 7,
      height: 1.625,
      left: 3,
      bottom: 3.875,
      inputs: [
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
        createNoninteractivePad(0.75, 0.75),
      ],
    },
    {
      id: 'Knobs',
      nRows: 1,
      nCols: 8,
      width: 6.75,
      height: 0.5,
      left: 3.125,
      bottom: 6,
      inputs: [
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
        createNoninteractiveKnob(0.5, 0.5),
      ],
    },
    {
      id: 'Transport',
      nRows: 2,
      nCols: 1,
      width: 0.5,
      height: 1.5,
      left: 10.375,
      bottom: 3.875,
      inputs: [
        {
          interactive: false,
          width: 0.5,
          height: 0.5,
          type: 'pad',
          shape: 'circle',
          style: {},
        },
        {
          interactive: false,
          width: 0.5,
          height: 0.5,
          type: 'pad',
          shape: 'circle',
          style: {},
        },
      ],
    },
    {
      id: 'Scene',
      nRows: 2,
      nCols: 1,
      width: 0.5,
      height: 0.875,
      left: 11.375,
      bottom: 4.25,
      inputs: [
        createNoninteractivePad(0.5, 0.3),
        createNoninteractivePad(0.5, 0.3),
      ],
    },
  ],
};
