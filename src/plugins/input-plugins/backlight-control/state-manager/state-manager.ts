export abstract class StateManager {
  public abstract state: number;

  public abstract totalStates: number;

  public abstract process(msg: NumberArrayWithStatus): number;
}
