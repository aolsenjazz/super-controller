export abstract class MessageResolver {
  public abstract resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus;
}
