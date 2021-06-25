import { VirtualDevice } from './virtual-devices';
import { DeviceDriver } from './driver-types';

/**
 * Driver for any device which does not yet have a driver. Made to look
 * as generic as possible.
 */
export const anonymousDriver: DeviceDriver = {
  width: 12,
  height: 6,
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
    width: 12,
    height: 4,
    bottom: 0,
    left: 0,
  },
  inputGrids: [
    {
      id: 'MainPads',
      nRows: 1,
      nCols: 6,
      width: 12,
      height: 2,
      bottom: 4,
      left: 0,
      inputs: [
        {
          default: {
            number: 0,
            channel: 0,
            eventType: 'noteon/noteoff',
            response: 'gate',
          },
          width: 1,
          height: 1,
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
          width: 1,
          height: 1,
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
          width: 1,
          height: 1,
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
          width: 1,
          height: 1,
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
          width: 1,
          height: 1,
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
          width: 1,
          height: 1,
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
