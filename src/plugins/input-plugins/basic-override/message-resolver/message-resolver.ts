export type ClassName =
  | 'PitchbendMessageResolver'
  | 'DiscreetMessageResolver'
  | 'ContinuousMessageResolver'
  | 'BinaryMessageResolver';

export interface MessageResolverDTO<T extends ClassName = ClassName> {
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  className: T;
}

export abstract class MessageResolver<
  T extends MessageResolverDTO = MessageResolverDTO
> {
  public abstract eligibleStatuses: (StatusString | 'noteon/noteoff')[];

  public abstract resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus;

  public abstract toDTO(): T;
}
