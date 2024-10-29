import type { MonoInteractiveDriver, SwitchDriver } from '../../types';
import type { PluginDTO } from '../../core/base-plugin';
import { BaseInputPlugin } from '../../core/base-input-plugin';

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

/**
 * Determines the appropriate MessageResolver based on the given output strategy and driver.
 *
 * @param outputStrategy - The output strategy to determine the resolver.
 * @param driver - The MonoInteractiveDriver instance providing context.
 * @returns An instance of a class implementing MessageResolver.
 */
function resolverForOutputStrategy(
  outputStrategy: StateManager['outputStrategy'],
  driver: MonoInteractiveDriver,
): ResolverType {
  switch (outputStrategy) {
    case 'gate':
    case 'toggle':
      return new BinaryMessageResolver(driver);
    case 'continuous':
      return driver.status === 'pitchbend'
        ? new PitchbendMessageResolver(driver)
        : new ContinuousMessageResolver(driver);
    default:
      return new DiscreteMessageResolver(outputStrategy, driver);
  }
}

/**
 * Union type representing all possible MessageResolver implementations.
 */
type ResolverType =
  | DiscreteMessageResolver
  | BinaryMessageResolver
  | PitchbendMessageResolver
  | ContinuousMessageResolver;

/**
 * Union type representing all possible MessageResolver DTOs.
 */
export type ResolverDTOType =
  | DiscreteMessageResolverDTO
  | BinaryMessageResolverDTO
  | PitchbendMessageResolverDTO
  | ContinuousMessageResolverDTO;

/**
 * Data Transfer Object (DTO) for BasicOverridePlugin.
 * Extends PluginDTO with additional properties specific to BasicOverridePlugin.
 */
export interface BasicOverrideDTO extends PluginDTO {
  /**
   * List of eligible output strategies for the state manager.
   */
  eligibleOutputStrategies: StateManager['eligibleOutputStrategies'];

  /**
   * The user-selected output strategy; not necessarily related to hardware.
   */
  outputStrategy: StateManager['outputStrategy'];

  /**
   * The DTO representation of the message resolver.
   */
  messageResolver: ResolverDTOType;
}

/**
 * BasicOverridePlugin is a plugin that receives signals from a hardware device,
 * and propagates different messages based on custom overrides, and response
 * strategies.
 */
export default class BasicOverridePlugin extends BaseInputPlugin {
  /**
   * Increments/toggles/changes state base on hardware and output response strategies.
   */
  private stateManager: StateManager;

  /**
   * Resolves messages based on the current state and message properties.
   */
  private messageResolver: ResolverType;

  /**
   * Creates an instance of BasicOverridePlugin from a DTO.
   *
   * @param dto - The Data Transfer Object containing plugin configuration.
   * @param driver - The MonoInteractiveDriver instance providing context.
   * @returns A new instance of BasicOverridePlugin.
   */
  public static override fromDTO(
    dto: BasicOverrideDTO,
    driver: MonoInteractiveDriver,
  ): BasicOverridePlugin {
    return new BasicOverridePlugin(dto.parentId, driver, dto);
  }

  /**
   * Constructs a BasicOverridePlugin instance.
   *
   * @param parentId - The identifier for the parent plugin or component.
   * @param driver - The MonoInteractiveDriver instance providing context.
   * @param dto - Optional DTO for initializing the plugin with specific configurations.
   */
  public constructor(
    parentId: string,
    driver: MonoInteractiveDriver,
    dto?: BasicOverrideDTO,
  ) {
    super(Manifest.title, Manifest.description, parentId, driver, dto?.id);

    // Determine the output strategy from DTO or fallback to driver's response
    const outputStrategy = dto?.outputStrategy || driver.response;

    // Initialize stateManager based on driver's response strategy
    switch (driver.response) {
      case 'gate':
        this.stateManager = new GateStateManager(driver);
        break;
      case 'toggle':
        this.stateManager = new TriggerStateManager(driver.response);
        break;
      case 'continuous':
        this.stateManager = new ContinuousStateManager();
        break;
      case 'n-step':
        this.stateManager = new TriggerStateManager(
          driver.response,
          (driver as SwitchDriver).steps.length,
        );
        break;
      default:
        this.stateManager = new TriggerStateManager(driver.response);
        break;
    }

    // Set the output strategy for the state manager
    this.stateManager.outputStrategy = outputStrategy;

    // Initialize messageResolver based on the determined output strategy
    this.messageResolver = resolverForOutputStrategy(outputStrategy, driver);

    if (dto) {
      this.applyDTO(dto);
    }
  }

  /**
   * Applies properties from a DTO to the current instance.
   *
   * @param other - The DTO containing properties to apply.
   * @returns A boolean indicating if the application was successful. (Currently always returns false)
   */
  public applyDTO(other: BasicOverrideDTO): boolean {
    if (other.outputStrategy !== this.stateManager.outputStrategy) {
      // Update messageResolver based on the new output strategy
      this.messageResolver = resolverForOutputStrategy(
        other.outputStrategy,
        this.driver,
      );

      // Update the state manager's output strategy
      this.stateManager.outputStrategy = other.outputStrategy;
    } else {
      // this is a gross "solution", but the way the update system is currently written,
      // `dto` is guaranteed to be the "correct" DTO in this case, so it's fine enough
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.messageResolver.applyDTO(other.messageResolver as any);

      // If the messageResolver is of type DiscreteMessageResolver, update totalStates accordingly
      if (this.messageResolver instanceof DiscreteMessageResolver) {
        this.stateManager.totalStates = this.messageResolver.nSteps;
      }
    }

    // Tell the application that updating this plugin should not trigger a resync of
    // the hardware with super controller.
    return false;
  }

  /**
   * Processes an incoming message and resolves it based on the current state and message resolver.
   *
   * @param msg - The incoming message represented as a NumberArrayWithStatus.
   * @returns The resolved value if the state is defined; otherwise, undefined.
   */
  public process(
    msg: NumberArrayWithStatus,
  ): NumberArrayWithStatus | undefined {
    const state = this.stateManager.process(msg);

    return state !== undefined
      ? this.messageResolver.resolve(state, msg)
      : undefined;
  }

  /**
   * Serializes the current state of the plugin to a DTO.
   *
   * @returns A BasicOverrideDTO representing the current state of the plugin.
   */
  public toDTO(): BasicOverrideDTO {
    return {
      ...super.toDTO(),
      eligibleOutputStrategies: this.stateManager.eligibleOutputStrategies,
      outputStrategy: this.stateManager.outputStrategy,
      messageResolver: this.messageResolver.toDTO(),
    };
  }

  /**
   * Initializes the plugin. Currently a no-operation method.
   * Can be overridden to include initialization logic if needed in the future.
   */
  public init(): void {
    // No operation needed for initialization
  }
}
