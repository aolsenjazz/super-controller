import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { msgIdentityEquals } from '@shared/util';

import { StateManager } from './state-manager';

export class GateStateManager extends StateManager {
  public eligibleOutputStrategies = [
    'gate' as const,
    'toggle' as const,
    'constant' as const,
    'n-step' as const,
  ];

  public totalStates: number = 2;

  public state: number = 0;

  private _outputStrategy: 'gate' | 'toggle' | 'constant' | 'n-step';

  private triggerSource: NumberArrayWithStatus;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    const { status, channel, number } = driver;

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
    outputStrategy: GateStateManager['_outputStrategy']
  ) {
    if (outputStrategy === 'gate') this.totalStates = 2;
    if (outputStrategy === 'toggle') this.totalStates = 2;
    if (outputStrategy === 'constant') this.totalStates = 1;
    if (outputStrategy === 'n-step') this.totalStates = 1;

    this.state = 0;
    this._outputStrategy = outputStrategy;
  }

  public process(msg: NumberArrayWithStatus) {
    if (this.outputStrategy === 'gate') return this.handleAsGate(msg);

    return this.handleAsNStep(msg);
  }

  private handleAsGate(msg: NumberArrayWithStatus) {
    this.state = msgIdentityEquals(msg, this.triggerSource) ? 1 : 0;
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
