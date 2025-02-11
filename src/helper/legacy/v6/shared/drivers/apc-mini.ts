import { PadDriver } from '../driver-types/input-drivers/pad-driver';
import { Color } from '../driver-types/color';
import { DeviceDriver } from '../driver-types/device-driver';
import { InputDriverWithHandle } from '../driver-types/input-drivers/input-driver-with-handle';

function createSlider(n: MidiNumber): InputDriverWithHandle {
  return {
    interactive: true,
    status: 'controlchange',
    number: n,
    channel: 0,
    response: 'continuous',
    type: 'slider',
    width: 0.625,
    height: 1.875,
    handleWidth: 0.625,
    handleHeight: 0.25,
    horizontal: false,
    inverted: false,
    shape: 'rect',
    availableColors: [],
    availableFx: [],
  };
}

function createPadColors(n: MidiNumber): Color[] {
  return [
    {
      default: true,
      name: 'Off',
      string: 'transparent',
      array: [144, n, 0],
      effectable: false,
    },
    {
      name: 'Green',
      string: '#4CAF50',
      array: [144, n, 1],
      effectable: false,
    },
    {
      modifier: 'blink',
      name: 'Green',
      string: '#4CAF50',
      array: [144, n, 2],
      effectable: false,
    },
    {
      name: 'Red',
      string: '#F44336',
      array: [144, n, 3],
      effectable: false,
    },
    {
      modifier: 'blink',
      name: 'Red',
      string: '#F44336',
      array: [144, n, 4],
      effectable: false,
    },
    {
      name: 'Yellow',
      string: '#FFC107',
      array: [144, n, 5],
      effectable: false,
    },
    {
      modifier: 'blink',
      name: 'Yellow',
      string: '#FFC107',
      array: [144, n, 6],
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
    response: 'gate',
    shape: 'rect',
    type: 'pad',
    width: 0.75,
    height: 0.3,
    availableColors: createPadColors(n),
    availableFx: [],
  };
}

function createCirclePadColors(n: MidiNumber): Color[] {
  return [
    {
      name: 'Off',
      string: 'transparent',
      default: true,
      array: [144, n, 0],
      effectable: false,
    },
    {
      name: 'Green',
      string: '#4CAF50',
      array: [144, n, 1],
      effectable: false,
    },
    {
      name: 'Green',
      modifier: 'blink',
      string: '#4CAF50',
      array: [144, n, 2],
      effectable: false,
    },
  ];
}

function createGreenCircle(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    response: 'gate',
    shape: 'circle',
    type: 'pad',
    width: 0.3,
    height: 0.3,
    availableColors: createCirclePadColors(n),
    availableFx: [],
  };
}

function createRedCircle(n: MidiNumber): PadDriver {
  return {
    interactive: true,
    status: 'noteon/noteoff',
    channel: 0,
    number: n,
    response: 'gate',
    shape: 'circle',
    type: 'pad',
    width: 0.3,
    height: 0.3,
    availableColors: [
      {
        name: 'Off',
        string: 'transparent',
        default: true,
        array: [144, n, 0],
        effectable: false,
      },
      {
        name: 'Red',
        string: '#F44336',
        array: [144, n, 1],
        effectable: false,
      },
      {
        name: 'Red',
        modifier: 'blink',
        string: '#F44336',
        array: [144, n, 2],
        effectable: false,
      },
    ],
    availableFx: [],
  };
}

export const Device: DeviceDriver = {
  name: 'APC MINI',
  type: 'normal',
  anonymous: false,
  width: 9.25,
  height: 7.75,
  controlSequence: [],
  style: {
    borderTopLeftRadius: '0.5em',
    borderTopRightRadius: '0.5em',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  inputGrids: [
    {
      id: 'Sliders',
      nRows: 1,
      nCols: 9,
      width: 8.75,
      height: 1.875,
      left: 0.375,
      bottom: 0.2,
      inputs: [
        createSlider(48),
        createSlider(49),
        createSlider(50),
        createSlider(51),
        createSlider(52),
        createSlider(53),
        createSlider(54),
        createSlider(55),
        createSlider(56),
      ],
    },
    {
      id: 'Pads',
      nRows: 9,
      nCols: 9,
      width: 8.75,
      height: 5.25,
      left: 0.375,
      bottom: 2.25,
      inputs: [
        createPad(56),
        createPad(57),
        createPad(58),
        createPad(59),
        createPad(60),
        createPad(61),
        createPad(62),
        createPad(63),
        createGreenCircle(82),
        createPad(48),
        createPad(49),
        createPad(50),
        createPad(51),
        createPad(52),
        createPad(53),
        createPad(54),
        createPad(55),
        createGreenCircle(83),
        createPad(40),
        createPad(41),
        createPad(42),
        createPad(43),
        createPad(44),
        createPad(45),
        createPad(46),
        createPad(47),
        createGreenCircle(84),
        createPad(32),
        createPad(33),
        createPad(34),
        createPad(35),
        createPad(36),
        createPad(37),
        createPad(38),
        createPad(39),
        createGreenCircle(85),
        createPad(24),
        createPad(25),
        createPad(26),
        createPad(27),
        createPad(28),
        createPad(29),
        createPad(30),
        createPad(31),
        createGreenCircle(86),
        createPad(16),
        createPad(17),
        createPad(18),
        createPad(19),
        createPad(20),
        createPad(21),
        createPad(22),
        createPad(23),
        createGreenCircle(87),
        createPad(8),
        createPad(9),
        createPad(10),
        createPad(11),
        createPad(12),
        createPad(13),
        createPad(14),
        createPad(15),
        createGreenCircle(88),
        createPad(0),
        createPad(1),
        createPad(2),
        createPad(3),
        createPad(4),
        createPad(5),
        createPad(6),
        createPad(7),
        createGreenCircle(89),
        createRedCircle(64),
        createRedCircle(65),
        createRedCircle(66),
        createRedCircle(67),
        createRedCircle(68),
        createRedCircle(69),
        createRedCircle(70),
        createRedCircle(71),
        {
          interactive: true,
          status: 'noteon/noteoff',
          channel: 0,
          number: 98,
          response: 'gate',
          shape: 'rect',
          type: 'pad',
          width: 0.3,
          height: 0.3,
          availableColors: [],
          availableFx: [],
        },
      ],
    },
  ],
};
