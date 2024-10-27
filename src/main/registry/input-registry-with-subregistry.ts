import { BaseInteractiveInputDriver } from '@plugins/types';
import {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';
import { SwitchConfig } from '@shared/hardware-config/input-config/switch-config';
import { XYConfig } from '@shared/hardware-config/input-config/xy-config';

import { Registry } from './registry';

/**
 * Similar to a simple input registry, but includes an additional registry
 * to store temporary references to configs. This is useful when a device
 * receives a message from a Switch or XY input, because those child configs
 * (switch steps or x-axis/y-axis configs) are stored here.
 *
 * Also guarantees that child configs won't be serialized with the rest of
 * the project.
 */
export class InputRegistryWithSubregistry extends Registry<
  InputDTO,
  BaseInputConfig
> {
  /**
   * Stores the child configs of XY and Switch configs.
   */
  InputSubregistry = new Registry<InputDTO, BaseInputConfig>();

  /**
   * Tries to return the requested item from its class' own store. If undefined,
   * tries to return the requested item from the subregistry.
   */
  public get<
    U extends BaseInputConfig<
      InputDTO,
      BaseInteractiveInputDriver
    > = BaseInputConfig<InputDTO, BaseInteractiveInputDriver>
  >(id: string): U | undefined {
    return super.get(id) || this.InputSubregistry.get(id);
  }

  public register(
    key: string,
    item: BaseInputConfig<InputDTO, BaseInteractiveInputDriver>
  ): void {
    super.register(key, item);

    if (item instanceof SwitchConfig) {
      item.steps.forEach((s) => {
        this.InputSubregistry.register(s.qualifiedId, s);
      });
    }

    if (item instanceof XYConfig) {
      this.InputSubregistry.register(item.x.qualifiedId, item.x);
      this.InputSubregistry.register(item.y.qualifiedId, item.y);
    }
  }
}
