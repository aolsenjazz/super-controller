import type { MonoInteractiveDriver } from '../../../types';
import { statusStringToNibble, msgIdentityEquals } from '../util';

import { StateManager, StateManagerDTO } from './state-manager';

interface GateStateManagerDTO extends StateManagerDTO {
  triggerSource: GateStateManager['triggerSource'];
}

export class GateStateManager extends StateManager {
  public eligibleOutputStrategies = [
    'gate' as const,
    'toggle' as const,
    'n-step' as const,
  ];

  public totalStates: number = 2;

  public state: number = 0;

  private _outputStrategy: 'gate' | 'toggle' | 'n-step';

  private triggerSource: NumberArrayWithStatus;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    const { status, number, channel } = driver;

    const triggerStatus =
      status === 'noteon/noteoff' ? 'noteon' : 'controlchange';
    const triggerStatusNibble = statusStringToNibble(triggerStatus) | channel;
    const triggerStatusByte = (triggerStatusNibble | channel) as StatusByte;

    this.triggerSource = [triggerStatusByte, number, 127];
    this._outputStrategy = 'gate';
  }

  public get outputStrategy() {
    return this._outputStrategy;
  }

  public set outputStrategy(
    outputStrategy: GateStateManager['_outputStrategy'],
  ) {
    if (outputStrategy === 'gate') this.totalStates = 2;
    if (outputStrategy === 'toggle') this.totalStates = 2;
    if (outputStrategy === 'n-step') this.totalStates = 2;

    this.state = 0;
    this._outputStrategy = outputStrategy;
  }

  public process(msg: NumberArrayWithStatus) {
    if (this.outputStrategy === 'gate') return this.handleAsGate();

    return this.handleAsNStep(msg);
  }

  public toDTO(): GateStateManagerDTO {
    return {
      totalStates: this.totalStates,
      outputStrategy: this.outputStrategy,
      triggerSource: this.triggerSource,
      type: 'GateStateManager' as const,
    };
  }

  private handleAsGate() {
    this.state = this.state === 1 ? 0 : 1;
    return this.state;
  }

  private handleAsNStep(msg: NumberArrayWithStatus) {
    // only respond to "presss" events
    if (msgIdentityEquals(msg, this.triggerSource)) {
      this.incrementState();
      return this.state;
    }

    return undefined;
  }

  private incrementState() {
    if (this.state === this.totalStates - 1) {
      this.state = 0;
    } else {
      this.state++;
    }
  }
}
