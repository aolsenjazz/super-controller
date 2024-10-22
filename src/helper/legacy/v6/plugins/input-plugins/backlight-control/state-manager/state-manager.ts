export interface StateManagerDTO {
  outputStrategy: StateManager['outputStrategy'];
  totalStates: StateManager['totalStates'];
  type: 'GateStateManager' | 'ContinuousStateManager' | 'TriggerStateManager';
}

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

  public abstract toDTO(): StateManagerDTO;

  public get availableStates() {
    return Array.from(Array(this.totalStates).keys());
  }
}
