import { MidiArray } from '../../midi-array';
import { SwitchDriver } from '../../driver-types';
import {
  BaseInputConfig,
  InputConfigStub,
  InputState,
} from './base-input-config';

export interface SwitchState extends InputState {
  step: NumberArrayWithStatus;
}

export interface SwitchConfigStub extends InputConfigStub {
  steps: Map<string, NumberArrayWithStatus>;
}

export class SwitchConfig extends BaseInputConfig {
  static fromDriver(d: SwitchDriver) {
    // TODO: interesting change of API here acutally - probably make ssense to rewrite this like an xy config, but just as a list of constant configs
    // const steps = new Map<string, MidiArray>(
    //   d.steps.map((step) => {
    //     return [JSON.stringify(step), create(step)];
    //   })
    // );

    return new SwitchConfig('', []);
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    // TODO:
    return msg;
  }

  applyStub(stub: SwitchConfigStub) {
    Array.from(stub.steps.keys()).forEach((k) => {
      // const asArr = JSON.parse(k);
      // const ma = create(stub.steps.get(k)!);
      // this.outputPropagator.setStep(asArr, ma);
      // TODO:
    });
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    // const ma = msg instanceof MidiArray ? msg : create(msg);

    // return Array.from(this.outputPropagator.steps.keys()).includes(
    //   JSON.stringify(ma.array)
    // ); TODO:
    return false;
  }

  get type() {
    return 'switch' as const;
  }

  get state() {
    return {
      step: [144, 0, 0] as NumberArrayWithStatus,
    };
  }

  get id() {
    // const def = this.outputPropagator.defaultStep;
    // return `switch.${def[1]}`;
    // TODO:
    return 'Switch';
  }
}
