import { DeviceDriver, FxDriver, Color } from '../driver-types';
import {
  PadDriver,
  KnobDriver,
  InputDriverWithHandle,
} from '../driver-types/input-drivers';

function defaultColors(channel: Channel, number: MidiNumber): Color[] {
  return [
    {
      array: [(144 + channel) as StatusByte, number, 0],
      name: 'Off',
      string: 'transparent',
      default: true,
      effectable: false,
    },
    {
      array: [(144 + channel) as StatusByte, number, 0],
      name: 'Red',
      string: 'red',
      effectable: false,
    },
  ];
}

function defaultFx(): FxDriver[] {
  return [
    {
      title: 'Solid',
      effect: 'Brightness',
      validVals: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 0, 2],
        [0, 0, 3],
        [0, 0, 4],
        [0, 0, 5],
        [0, 0, 6],
        [0, 0, 7],
        [0, 0, 8],
        [0, 0, 9],
        [0, 0, 10],
        [0, 0, 11],
        [0, 0, 12],
        [0, 0, 13],
        [0, 0, 14],
        [0, 0, 15],
      ],
      defaultVal: [0, 0, 15],
      isDefault: true,
      lowBoundLabel: 'dim',
      highBoundLabel: 'bright',
    },
  ];
}

function bigKnob(
  channel: Channel,
  number: MidiNumber,
  mode: 'absolute' | 'endless' = 'absolute'
): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    number,
    channel,
    response: 'continuous',
    type: 'knob',
    width: 0.75,
    height: 0.75,
    shape: 'circle',
    knobType: mode,
    availableColors: [],
    availableFx: [],
  };
}

function smallKnob(
  channel: Channel,
  number: MidiNumber,
  mode: 'absolute' | 'endless' = 'absolute'
): KnobDriver {
  return {
    interactive: true,
    status: 'controlchange',
    number,
    channel,
    response: 'continuous',
    type: 'knob',
    width: 0.375,
    height: 0.375,
    shape: 'circle',
    knobType: mode,
    availableColors: [],
    availableFx: [],
  };
}

function widePad(channel: Channel, number: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 0.875,
    height: 0.25,
    availableColors: defaultColors(channel, number),
    availableFx: defaultFx(),
  };
}

function smallPad(channel: Channel, number: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 0.45,
    height: 0.25,
    availableColors: defaultColors(channel, number),
    availableFx: defaultFx(),
  };
}

function defaultPad(channel: Channel, number: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 0.875,
    height: 0.625,
    availableColors: defaultColors(channel, number),
    availableFx: defaultFx(),
  };
}

function playPad(channel: Channel, number: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 0.875,
    height: 0.625,
    availableColors: [
      {
        array: [(144 + channel) as StatusByte, number, 0],
        name: 'Off',
        string: 'transparent',
        default: true,
        effectable: false,
      },
      {
        array: [(144 + channel) as StatusByte, number, 0],
        name: 'Green',
        string: 'green',
        effectable: false,
      },
    ],
    availableFx: defaultFx(),
  };
}

function circlePad(
  channel: Channel,
  number: MidiNumber,
  colorCapable = true
): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'circle',
    type: 'pad',
    width: 0.5,
    height: 0.5,
    availableColors: colorCapable ? defaultColors(channel, number) : [],
    availableFx: colorCapable ? defaultFx() : [],
  };
}

function smallCirclePad(
  channel: Channel,
  number: MidiNumber,
  colorCapable = false
): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel,
    number,
    response: 'gate',
    shape: 'circle',
    type: 'pad',
    width: 0.25,
    height: 0.25,
    availableColors: colorCapable ? defaultColors(channel, number) : [],
    availableFx: colorCapable ? defaultFx() : [],
  };
}

function slider(channel: Channel, number: MidiNumber): InputDriverWithHandle {
  return {
    interactive: true,
    status: 'controlchange',
    number,
    channel,
    response: 'continuous',
    type: 'slider',
    width: 0.8,
    height: 2,
    shape: 'rect',
    availableColors: [],
    availableFx: [],
    handleHeight: 0.25,
    handleWidth: 0.8,
    horizontal: false,
    inverted: false,
  };
}

export const Device: DeviceDriver = {
  name: 'MixTrack Pro FX',
  type: 'normal',
  anonymous: false,
  height: 9.5,
  width: 21.2,
  style: {},
  controlSequence: [
    [240, 0, 32, 127, 3, 1, 247],
    [240, 126, 0, 6, 1, 247],
    [240, 0, 32, 127, 19, 247],
  ],
  inputGrids: [
    {
      id: 'MasterKnob',
      height: 0.5,
      width: 0.5,
      left: 20.2,
      bottom: 8.375,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 35,
          channel: 14,
          response: 'continuous',
          type: 'knob',
          width: 0.5,
          height: 0.5,
          shape: 'circle',
          knobType: 'absolute',
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'MicKnob',
      height: 0.5,
      width: 0.5,
      left: 0.5,
      bottom: 8.375,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: false,
          width: 0.5,
          height: 0.5,
          type: 'knob',
          shape: 'circle',
        },
      ],
    },
    {
      id: 'Big Turny Boi Left',
      height: 6,
      width: 6,
      left: 0.625,
      bottom: 3,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 6,
          channel: 0,
          response: 'continuous',
          type: 'knob',
          width: 6,
          height: 6,
          shape: 'circle',
          knobType: 'endless',
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Big Turny Boi Right',
      height: 6,
      width: 6,
      left: 13.6,
      bottom: 3,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 6,
          channel: 1,
          response: 'continuous',
          type: 'knob',
          width: 6,
          height: 6,
          shape: 'circle',
          knobType: 'endless',
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Big Slider Left',
      height: 4.625,
      width: 0.75,
      left: 7,
      bottom: 3.125,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 9,
          channel: 0,
          response: 'continuous',
          type: 'slider',
          width: 0.75,
          height: 4.625,
          shape: 'rect',
          handleWidth: 0.75,
          handleHeight: 0.5,
          horizontal: false,
          inverted: true,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Big Slider Right',
      height: 4.625,
      width: 0.75,
      left: 20.1,
      bottom: 3.125,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 9,
          channel: 1,
          response: 'continuous',
          type: 'slider',
          width: 0.75,
          height: 4.625,
          shape: 'rect',
          handleWidth: 0.75,
          handleHeight: 0.5,
          horizontal: false,
          inverted: true,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
    {
      id: 'Switches',
      height: 1.125,
      width: 3,
      left: 9.125,
      bottom: 4.25,
      nRows: 1,
      nCols: 2,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 3,
          channel: 8,
          response: 'enumerated',
          type: 'switch',
          width: 0.75,
          height: 1.125,
          shape: 'rect',
          availableFx: [],
          availableColors: [],
          steps: [
            [184, 3, 1],
            [184, 3, 0],
            [184, 3, 2],
          ],
          stepLabels: ['Up', 'Middle', 'Down'],
          sequential: false,
          initialStep: 1,
          inverted: false,
          horizontal: false,
        },
        {
          interactive: true,
          status: 'controlchange',
          number: 3,
          channel: 9,
          response: 'enumerated',
          type: 'switch',
          width: 0.75,
          height: 1.125,
          shape: 'rect',
          availableFx: [],
          availableColors: [],
          steps: [
            [185, 3, 1],
            [185, 3, 0],
            [185, 3, 2],
          ],
          stepLabels: ['Up', 'Middle', 'Down'],
          sequential: false,
          initialStep: 1,
          inverted: false,
          horizontal: false,
        },
      ],
    },
    {
      id: 'InOutRight',
      height: 0.25,
      width: 1.5,
      left: 19.375,
      bottom: 0.25,
      nRows: 1,
      nCols: 2,
      inputs: [smallPad(5, 52), smallPad(5, 53)],
    },
    {
      id: 'InOutLeft',
      height: 0.25,
      width: 1.5,
      left: 6.125,
      bottom: 0.25,
      nRows: 1,
      nCols: 2,
      inputs: [smallPad(4, 52), smallPad(4, 53)],
    },
    {
      id: 'ReloopRight',
      height: 0.25,
      width: 0.875,
      left: 19.7,
      bottom: 1,
      nRows: 1,
      nCols: 1,
      inputs: [widePad(5, 64)],
    },
    {
      id: 'ReloopLeft',
      height: 0.25,
      width: 0.875,
      left: 6.4,
      bottom: 1,
      nRows: 1,
      nCols: 1,
      inputs: [widePad(4, 64)],
    },
    {
      id: 'PBRight',
      height: 0.25,
      width: 1.1,
      left: 19.9,
      bottom: 2.5,
      nRows: 1,
      nCols: 2,
      inputs: [smallCirclePad(1, 12, false), smallCirclePad(1, 11, false)],
    },
    {
      id: 'PBLeft',
      height: 0.25,
      width: 1.1,
      left: 6.9,
      bottom: 2.5,
      nRows: 1,
      nCols: 2,
      inputs: [smallCirclePad(0, 12, false), smallCirclePad(0, 11, false)],
    },
    {
      id: 'BleepRight',
      height: 0.5,
      width: 0.5,
      left: 19.25,
      bottom: 2.5,
      nRows: 1,
      nCols: 2,
      inputs: [circlePad(1, 7)],
    },
    {
      id: 'BleepLeft',
      height: 0.5,
      width: 0.5,
      left: 6.1,
      bottom: 2.5,
      nRows: 1,
      nCols: 2,
      inputs: [circlePad(0, 7)],
    },
    {
      id: 'MainPadsRight',
      height: 2.625,
      width: 4.3,
      left: 14.5,
      bottom: 0.25,
      nRows: 3,
      nCols: 4,
      inputs: [
        widePad(5, 0),
        widePad(5, 13),
        widePad(5, 7),
        widePad(5, 11),
        defaultPad(5, 20),
        defaultPad(5, 21),
        defaultPad(5, 22),
        defaultPad(5, 23),
        defaultPad(5, 24),
        defaultPad(5, 25),
        defaultPad(5, 26),
        defaultPad(5, 27),
      ],
    },
    {
      id: 'MainPadsLeft',
      height: 2.625,
      width: 4.3,
      left: 1.4,
      bottom: 0.25,
      nRows: 3,
      nCols: 4,
      inputs: [
        widePad(4, 0),
        widePad(4, 13),
        widePad(4, 7),
        widePad(4, 11),
        defaultPad(4, 20),
        defaultPad(4, 21),
        defaultPad(4, 22),
        defaultPad(4, 23),
        defaultPad(4, 24),
        defaultPad(4, 25),
        defaultPad(4, 26),
        defaultPad(4, 27),
      ],
    },
    {
      id: 'SyncRight',
      height: 2.625,
      width: 0.875,
      left: 13.3,
      bottom: 0.25,
      nRows: 3,
      nCols: 1,
      inputs: [widePad(1, 2), defaultPad(1, 1), playPad(1, 0)],
    },
    {
      id: 'SyncLeft',
      height: 2.625,
      width: 0.875,
      left: 0.25,
      bottom: 0.25,
      nRows: 3,
      nCols: 1,
      inputs: [widePad(0, 2), defaultPad(0, 1), playPad(0, 0)],
    },
    {
      id: 'ShiftRight',
      height: 0.5,
      width: 0.5,
      left: 13.7,
      bottom: 2.9,
      nRows: 1,
      nCols: 1,
      inputs: [circlePad(1, 32, false)],
    },
    {
      id: 'ShiftLeft',
      height: 0.5,
      width: 0.5,
      left: 0.75,
      bottom: 2.9,
      nRows: 1,
      nCols: 1,
      inputs: [circlePad(0, 32, false)],
    },
    {
      id: 'SliderRight',
      height: 2,
      width: 0.8,
      left: 12.25,
      bottom: 1.75,
      nRows: 1,
      nCols: 1,
      inputs: [slider(1, 28)],
    },
    {
      id: 'SliderLeft',
      height: 2,
      width: 0.8,
      left: 8.3,
      bottom: 1.75,
      nRows: 1,
      nCols: 1,
      inputs: [slider(0, 28)],
    },
    {
      id: 'FilterRight',
      height: 0.75,
      width: 0.75,
      left: 12.3,
      bottom: 4.25,
      nRows: 1,
      nCols: 1,
      inputs: [bigKnob(1, 26)],
    },
    {
      id: 'FilterLeft',
      height: 0.75,
      width: 0.75,
      left: 8.3,
      bottom: 4.25,
      nRows: 1,
      nCols: 1,
      inputs: [bigKnob(0, 26)],
    },
    {
      id: 'KnobsRight',
      height: 4,
      width: 0.375,
      left: 12.45,
      bottom: 5.3,
      nRows: 4,
      nCols: 1,
      inputs: [
        smallKnob(1, 22),
        smallKnob(1, 23),
        smallKnob(1, 24),
        smallKnob(1, 25),
      ],
    },
    {
      id: 'KnobsLeft',
      height: 4,
      width: 0.375,
      left: 8.5,
      bottom: 5.3,
      nRows: 4,
      nCols: 1,
      inputs: [
        smallKnob(0, 22),
        smallKnob(0, 23),
        smallKnob(0, 24),
        smallKnob(0, 25),
      ],
    },
    {
      id: 'CueRight',
      height: 0.25,
      width: 0.25,
      left: 11.375,
      bottom: 3.5,
      nRows: 1,
      nCols: 1,
      inputs: [smallCirclePad(1, 27, true)],
    },
    {
      id: 'CueLeft',
      height: 0.25,
      width: 0.25,
      left: 9.5,
      bottom: 3.5,
      nRows: 1,
      nCols: 1,
      inputs: [smallCirclePad(0, 27, true)],
    },
    {
      id: 'MixKnobs',
      height: 1.75,
      width: 0.375,
      left: 10.4,
      bottom: 1.7,
      nRows: 2,
      nCols: 1,
      inputs: [smallKnob(14, 47), smallKnob(14, 39)],
    },
    {
      id: 'MixFader',
      height: 0.8,
      width: 2,
      left: 9.6,
      bottom: 0.5,
      nRows: 1,
      nCols: 1,
      inputs: [
        {
          interactive: true,
          status: 'controlchange',
          number: 8,
          channel: 15,
          response: 'continuous',
          type: 'slider',
          width: 2,
          height: 0.8,
          shape: 'rect',
          availableColors: [],
          availableFx: [],
          handleHeight: 0.25,
          handleWidth: 0.8,
          horizontal: true,
          inverted: false,
        },
      ],
    },
    {
      id: 'FXSelect',
      height: 0.875,
      width: 2.125,
      left: 9.6,
      bottom: 5.875,
      nRows: 2,
      nCols: 3,
      inputs: [
        smallPad(8, 0),
        smallPad(8, 1),
        smallPad(8, 2),
        smallPad(9, 3),
        smallPad(9, 4),
        smallPad(9, 5),
      ],
    },
    {
      id: 'Tap',
      height: 0.25,
      width: 0.375,
      left: 10.475,
      bottom: 7,
      nRows: 1,
      nCols: 1,
      inputs: [smallPad(8, 9)],
    },
    {
      id: 'DryWet',
      height: 0.375,
      width: 0.375,
      left: 9.75,
      bottom: 7.45,
      nRows: 1,
      nCols: 1,
      inputs: [smallKnob(8, 4)],
    },
    {
      id: 'Beats',
      height: 0.375,
      width: 0.375,
      left: 11.15,
      bottom: 7.45,
      nRows: 1,
      nCols: 1,
      inputs: [smallKnob(8, 5, 'endless')],
    },
    {
      id: 'Browse',
      height: 0.75,
      width: 0.75,
      left: 10.25,
      bottom: 8.375,
      nRows: 1,
      nCols: 1,
      inputs: [bigKnob(15, 0, 'endless')],
    },
    {
      id: 'DoublesRight',
      height: 0.25,
      width: 0.25,
      left: 11.375,
      bottom: 8.6,
      nRows: 1,
      nCols: 1,
      inputs: [smallCirclePad(15, 3, false)],
    },
    {
      id: 'DoublesLeft',
      height: 0.25,
      width: 0.25,
      left: 9.6,
      bottom: 8.6,
      nRows: 1,
      nCols: 1,
      inputs: [smallCirclePad(15, 2, false)],
    },
  ],
};
