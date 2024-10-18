import { StateManager } from './state-manager';

export class ToggleStateManager extends StateManager {
  public eligibleOutputStrategies = [
    'toggle' as const,
    'constant' as const,
    'n-step' as const,
  ];

  public totalStates: number = 2;

  public state: number = 0;

  private _outputStrategy: 'toggle' | 'constant' | 'n-step';

  public constructor() {
    super();

    this._outputStrategy = 'toggle';
  }

  public get outputStrategy() {
    return this._outputStrategy;
  }

  public set outputStrategy(
    outputStrategy: ToggleStateManager['_outputStrategy']
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
