import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlIcicle extends PluginDTO {}

export default class BacklightControlPlugin extends BasePlugin<PluginDTO> {
  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public toDTO(): PluginDTO {
    return {
      ...super.toDTO(),
    };
  }

  public applyIcicle(icicle: PluginDTO): void {
    super.applyDTO(icicle);
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public get aggregateCapable() {
    return true;
  }
}
