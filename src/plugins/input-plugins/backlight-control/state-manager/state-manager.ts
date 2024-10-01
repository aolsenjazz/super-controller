export abstract class StateManager {
  public abstract state: number;

  public abstract totalStates: number;

  public abstract process(msg: NumberArrayWithStatus): number;

  public get availableStates() {
    return Array.from(Array(this.totalStates).keys());
  }
}
