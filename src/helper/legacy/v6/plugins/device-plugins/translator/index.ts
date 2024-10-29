import { MessageProcessorMeta } from '../../types';
import { BaseDevicePlugin } from '../../core/base-device-plugin';
import { PluginDTO } from '../../core/base-plugin';

import { toString } from './util';
import Manifest from './manifest';

export interface TranslatorDTO extends PluginDTO {
  overrides: Record<string, NumberArrayWithStatus | undefined>;
}

export default class TranslatorPlugin extends BaseDevicePlugin<TranslatorDTO> {
  overrides: Record<string, NumberArrayWithStatus | undefined> = {};

  public static override fromDTO(dto: TranslatorDTO) {
    return new TranslatorPlugin(dto.parentId, dto.id, dto.overrides);
  }

  public constructor(
    parentId: string,
    id?: string,
    overrides?: TranslatorPlugin['overrides'],
  ) {
    super(Manifest.title, Manifest.description, parentId, id);

    if (overrides) {
      this.overrides = overrides;
    }
  }

  public init() {
    // noop
  }

  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    const override = this.overrides[toString(msg)];
    return override || msg;
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }

  public applyDTO(dto: TranslatorDTO) {
    this.overrides = dto.overrides;
    return false;
  }
}
