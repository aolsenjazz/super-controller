import { VirtualDevice } from './virtual-devices';
import { DeviceDriver } from './driver-types';

export const anonymousDriver: DeviceDriver = {
  aspectRatio: '4/2',
  name: 'Anonymous',
  style: {
    borderBottomLeftRadius: '1em',
    borderTopLeftRadius: '1em',
    borderTopRightRadius: '1em',
    borderBottomRightRadius: '1em',
  },
  keyboard: {
    defaultOctave: 0,
    nOctaves: 1,
    channel: 0,
    style: {
      width: '95%',
      height: '70%',
      bottom: '0',
      left: '2.5%',
    },
  },
  inputGrids: [
    {
      id: 'MainPads',
      height: 0.05,
      width: 0.05,
      nRows: 1,
      nCols: 6,
      style: {
        width: '95%',
        height: '10%',
        top: '5%',
        left: '2.5%',
      },
      inputs: [
        {
          default: {
            number: 0,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          type: 'pad',
          overrideable: false,
          availableColors: [],
        },
        {
          default: {
            number: 1,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          overrideable: false,
          type: 'pad',
          availableColors: [],
        },
        {
          default: {
            number: 2,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          overrideable: false,
          type: 'pad',
          availableColors: [],
        },
        {
          default: {
            number: 3,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          overrideable: false,
          type: 'pad',
          availableColors: [],
        },
        {
          default: {
            number: 4,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          type: 'pad',
          overrideable: false,
          availableColors: [],
        },
        {
          default: {
            number: 5,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          shape: 'rect',
          overrideable: false,
          type: 'pad',
          availableColors: [],
        },
      ],
    },
  ],
};

export class AnonymousDevice extends VirtualDevice {
  constructor(id: string) {
    super(id, anonymousDriver);
  }
}
