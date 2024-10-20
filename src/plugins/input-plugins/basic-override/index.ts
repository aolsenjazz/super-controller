import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginDTO } from '@shared/plugin-core/base-plugin';

import { ContinuousStateManager } from './state-manager/continuous-state-manager';
import { GateStateManager } from './state-manager/gate-state-manager';
import { StateManager } from './state-manager/state-manager';
import { TriggerStateManager } from './state-manager/trigger-state-manager';

import { MessageResolver } from './message-resolver/message-resolver';
import { DiscreetMessageResolver } from './message-resolver/discreet-message-resolver';
import { BinaryMessageResolver } from './message-resolver/binary-message-resolver';
import { PitchbendMessageResolver } from './message-resolver/pitchbend-message-resolver';
import { ContinuousMessageResolver } from './message-resolver/continuous-message-resolver';

import Manifest from './manifest';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideDTO extends PluginDTO {}

export default class BasicOverridePlugin extends BaseInputPlugin {
  private stateManager: StateManager;

  private messageResolver: MessageResolver;

  public constructor(parentId: string, driver: MonoInteractiveDriver) {
    super(Manifest.title, Manifest.description, parentId, driver);

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
          ? new DiscreetMessageResolver(driver)
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
    };
  }

  public applyDTO(_dto: BasicOverrideDTO): void {}

  public init() {
    // noop
  }
}
