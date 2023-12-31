/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { MidiArray, create } from '../../midi-array';
import { NonsequentialStepPropagator } from '../../propagators';
import { InputResponse, SwitchDriver } from '../../driver-types';
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

@Revivable.register
export class SwitchConfig extends BaseInputConfig {
  private outputPropagator: NonsequentialStepPropagator;

  #nickname?: string;

  static fromDriver(d: SwitchDriver) {
    const steps = new Map<string, MidiArray>(
      d.steps.map((step) => {
        return [JSON.stringify(step), create(step)];
      })
    );

    const outputPropagator = new NonsequentialStepPropagator(
      steps,
      d.steps[d.initialStep]
    );

    return new SwitchConfig(outputPropagator);
  }

  constructor(
    outputPropagator: NonsequentialStepPropagator,
    nickname?: string
  ) {
    super();

    this.outputPropagator = outputPropagator;
    this.#nickname = nickname;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.outputPropagator, this.nickname],
    };
  }

  restoreDefaults() {
    this.outputPropagator.restoreDefaults();
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    return this.outputPropagator.handleMessage(msg);
  }

  applyStub(stub: SwitchConfigStub) {
    Array.from(stub.steps.keys()).forEach((k) => {
      const asArr = JSON.parse(k);
      const ma = create(stub.steps.get(k)!);
      this.outputPropagator.setStep(asArr, ma);
    });
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    const ma = msg instanceof MidiArray ? msg : create(msg);

    return Array.from(this.outputPropagator.steps.keys()).includes(
      JSON.stringify(ma.array)
    );
  }

  /**
   * Returns the override for the given step
   */
  responseForStep(msg: NumberArrayWithStatus) {
    return this.outputPropagator.responseForStep(msg);
  }

  get config(): SwitchConfigStub {
    return {
      id: this.id,
      steps: this.outputPropagator.steps,
      type: 'switch',
    };
  }

  get state() {
    return {
      step: this.outputPropagator.lastStep,
    };
  }

  get response(): InputResponse {
    return this.outputPropagator.outputResponse;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }

  get nickname() {
    return this.#nickname || `Switch ${this.state.step[1]}`;
  }

  get id() {
    const def = this.outputPropagator.defaultStep;
    return `switch.${def[1]}`;
  }
}
