import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginDTO } from '@shared/plugin-core/base-plugin';

import { ContinuousStateManager } from './state-manager/continuous-state-manager';
import { GateStateManager } from './state-manager/gate-state-manager';
import { StateManager } from './state-manager/state-manager';
import { TriggerStateManager } from './state-manager/trigger-state-manager';

import {
  DiscreteMessageResolver,
  DiscreteMessageResolverDTO,
} from './message-resolver/discrete-message-resolver';
import {
  BinaryMessageResolver,
  BinaryMessageResolverDTO,
} from './message-resolver/binary-message-resolver';
import {
  PitchbendMessageResolver,
  PitchbendMessageResolverDTO,
} from './message-resolver/pitchbend-message-resolver';
import {
  ContinuousMessageResolver,
  ContinuousMessageResolverDTO,
} from './message-resolver/continuous-message-resolver';

import Manifest from './manifest';

type ResolverType =
  | DiscreteMessageResolver
  | BinaryMessageResolver
  | PitchbendMessageResolver
  | ContinuousMessageResolver;

export type ResolverDTOType =
  | DiscreteMessageResolverDTO
  | BinaryMessageResolverDTO
  | PitchbendMessageResolverDTO
  | ContinuousMessageResolverDTO;

export interface BasicOverrideDTO extends PluginDTO {
  eligibleOutputStrategies: StateManager['eligibleOutputStrategies'];
  outputStrategy: StateManager['outputStrategy'];
  messageResolver: ResolverDTOType;
}

export default class BasicOverridePlugin extends BaseInputPlugin {
  private stateManager: StateManager;

  private messageResolver: ResolverType;

  public constructor(parentId: string, driver: MonoInteractiveDriver) {
    super(Manifest.title, Manifest.description, parentId, driver);
    this.driver = driver;

    if (driver.response === 'gate') {
      this.stateManager = new GateStateManager(driver);
      this.messageResolver = new BinaryMessageResolver(driver);
    } else if (driver.response === 'continuous') {
      this.stateManager = new ContinuousStateManager();

      this.messageResolver =
        driver.status === 'pitchbend'
          ? new PitchbendMessageResolver(driver)
          : new ContinuousMessageResolver(driver);
    } else {
      this.stateManager = new TriggerStateManager(
        driver.response as 'toggle' | 'constant'
      );

      this.messageResolver =
        driver.response === 'constant'
          ? new DiscreteMessageResolver(driver.response, driver)
          : new BinaryMessageResolver(driver);
    }
  }

  public process(msg: NumberArrayWithStatus) {
    const state = this.stateManager.process(msg);

    return state !== undefined
      ? this.messageResolver.resolve(state, msg)
      : undefined;
  }

  public toDTO(): BasicOverrideDTO {
    return {
      ...super.toDTO(),
      eligibleOutputStrategies: this.stateManager.eligibleOutputStrategies,
      outputStrategy: this.stateManager.outputStrategy,
      messageResolver: this.messageResolver.toDTO(),
    };
  }

  public applyDTO(other: BasicOverrideDTO): void {
    if (other.outputStrategy !== this.stateManager.outputStrategy) {
      if (other.outputStrategy === 'gate') {
        this.messageResolver = new BinaryMessageResolver(this.driver);
      } else if (other.outputStrategy === 'continuous') {
        this.messageResolver =
          this.driver.status === 'pitchbend'
            ? new PitchbendMessageResolver(this.driver)
            : new ContinuousMessageResolver(this.driver);
      } else {
        this.messageResolver = new DiscreteMessageResolver(
          other.outputStrategy,
          this.driver
        );
      }

      this.stateManager.outputStrategy = other.outputStrategy;
    } else {
      // this is a gross "solution", but the way the update system is currently written,
      // `dto` is guaranteed to be the "correct" DTO in this case, so it's fine enough
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.messageResolver.applyDTO(other.messageResolver as any);
    }
  }

  public init() {
    // noop
  }
}
