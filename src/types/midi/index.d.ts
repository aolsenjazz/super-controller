/* eslint-disable */

declare module 'midi' {
  export class Input {
    getPortCount: () => number;
    getPortName: (index: number) => string;
    openPort: (index: number) => void;
    closePort: () => void;
    on: (
      event: string,
      cb: (deltaTime: number, message: MidiTuple) => void
    ) => void;
    openVirtualPort: (name: string) => void;
    isPortOpen: () => boolean;
  }

  export class Output {
    getPortCount: () => number;
    getPortName: (index: number) => string;
    openPort: (index: number) => void;
    closePort: () => void;
    openVirtualPort: (name: string) => void;
    sendMessage: (message: number[]) => void;
    isPortOpen: () => boolean;
  }
}
