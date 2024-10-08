import { InputResponse } from '@shared/driver-types/input-drivers/mono-interactive-driver';

function msgToString(msg: NumberArrayWithStatus) {
  return `${msg[0]} ${msg[1]} ${msg[2]}`;
}

export class TwoStepPropagator {
  inputResponse: InputResponse;

  outputResponse: InputResponse;

  responseMap: Record<string, NumberArrayWithStatus> = {};

  /**
   * With lights having different
   */
  lastReceived: string = 'nonactionable';

  constructor(inputResponse: InputResponse, outputResponse: InputResponse) {
    this.inputResponse = inputResponse;
    this.outputResponse = outputResponse;
  }

  process(msg: NumberArrayWithStatus): NumberArrayWithStatus {
    const str = msgToString(msg);
    this.lastReceived = str;
    return this.responseMap[str];
  }
}
