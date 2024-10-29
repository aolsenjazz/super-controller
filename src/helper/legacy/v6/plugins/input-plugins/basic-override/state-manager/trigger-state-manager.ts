import { StateManager } from './state-manager';

/**
 * Manages state for inputs which react only once to a single press, e.g. constant
 * and toggle inputs.
 */
export class TriggerStateManager extends StateManager {
  public eligibleOutputStrategies = [
    'toggle' as const,
    'constant' as const,
    'n-step' as const,
  ];

  public totalStates: number = 2;

  public state: number = 0;

  private _outputStrategy: 'toggle' | 'constant' | 'n-step' = 'toggle';

  public constructor(
    outputStrategy: TriggerStateManager['_outputStrategy'] | 'enumerated',
    nSteps?: number,
  ) {
    super();

    this.outputStrategy =
      outputStrategy === 'enumerated' ? 'n-step' : outputStrategy;

    if (nSteps !== undefined) this.totalStates = nSteps;
  }

  public get outputStrategy() {
    return this._outputStrategy;
  }

  public set outputStrategy(
    outputStrategy: TriggerStateManager['_outputStrategy'],
  ) {
    if (outputStrategy === 'toggle') this.totalStates = 2;
    if (outputStrategy === 'constant') this.totalStates = 1;
    if (outputStrategy === 'n-step') this.totalStates = 1;

    this.state = 0;
    this._outputStrategy = outputStrategy;
  }

  public process() {
    this.incrementState();
    return this.state;
  }

  private incrementState() {
    if (this.state === this.totalStates - 1) {
      this.state = 0;
    } else {
      this.state++;
    }
  }
}
