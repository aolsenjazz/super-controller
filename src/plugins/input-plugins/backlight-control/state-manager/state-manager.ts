export abstract class StateManager {
  public abstract state: number;

  public abstract totalStates: number;

  public abstract eligibleOutputStrategies: (
    | 'gate'
    | 'toggle'
    | 'constant'
    | 'n-step'
    | 'continuous'
  )[];

  public abstract outputStrategy:
    | 'gate'
    | 'toggle'
    | 'constant'
    | 'n-step'
    | 'continuous';

  public abstract process(msg: NumberArrayWithStatus): number | undefined;

  public get availableStates() {
    return Array.from(Array(this.totalStates).keys());
  }
}
