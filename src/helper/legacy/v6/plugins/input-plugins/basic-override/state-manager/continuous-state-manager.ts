import { StateManager } from './state-manager';

export class ContinuousStateManager extends StateManager {
  public eligibleOutputStrategies = [
    'continuous' as const,
    'constant' as const,
  ];

  public state = 0;

  public totalStates = 1;

  public outputStrategy: 'continuous' | 'constant';

  public constructor() {
    super();

    this.outputStrategy = 'continuous';
  }

  public process() {
    return 0;
  }
}
