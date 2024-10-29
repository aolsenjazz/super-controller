export type ClassName =
  | 'PitchbendMessageResolver'
  | 'DiscreteMessageResolver'
  | 'ContinuousMessageResolver'
  | 'BinaryMessageResolver';

export interface MessageResolverDTO<T extends ClassName = ClassName> {
  eligibleStatuses: MessageResolver['eligibleStatuses'];
  className: T;
}

export abstract class MessageResolver<
  T extends MessageResolverDTO = MessageResolverDTO,
> {
  public abstract readonly eligibleStatuses: (
    | StatusString
    | 'noteon/noteoff'
  )[];

  public abstract resolve(
    state: number,
    msg: NumberArrayWithStatus,
  ): NumberArrayWithStatus;

  public abstract toDTO(): T;

  public abstract applyDTO(resolver: T): void;
}
