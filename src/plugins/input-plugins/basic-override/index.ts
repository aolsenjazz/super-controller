import { BaseInteractiveInputDriver } from '@shared/driver-types/input-drivers/base-interactive-input-driver';
import { MessageProcessorMeta } from '@shared/message-processor';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginDTO } from '@shared/plugin-core/base-plugin';

import Manifest from './manifest.json';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideDTO extends PluginDTO {}

export default class BasicOverridePlugin extends BaseInputPlugin<BasicOverrideDTO> {
  public constructor(parentId: string, driver: BaseInteractiveInputDriver) {
    super(Manifest.title, Manifest.description, parentId, driver);
  }

  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    return msg;
  }

  public freeze(): BasicOverrideDTO {
    return {
      ...super.toDTO(),
    };
  }

  public applyDTO(_dto: BasicOverrideDTO): void {}

  public init() {
    // noop
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
