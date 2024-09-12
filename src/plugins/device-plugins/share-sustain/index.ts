import { MidiArray } from '@shared/midi-array';

import { BasePlugin } from '@shared/plugin-core/base-plugin';
import { ShareSustainIcicle } from './share-sustain-icicle';

export default class ShareSustainPlugin extends BasePlugin<ShareSustainIcicle> {
  private sustainTargets: string[] = [];

  constructor(
    title: string,
    description: string,
    sustainTargets: string[] = []
  ) {
    super(title, description);
    this.sustainTargets = sustainTargets;
  }

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze(): ShareSustainIcicle {
    return {
      ...super.freeze(),
      sustainTargets: this.sustainTargets,
    };
  }

  public applyIcicle(icicle: ShareSustainIcicle): void {
    super.applyIcicle(icicle);
    this.sustainTargets = icicle.sustainTargets;
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public get aggregateCapable() {
    return false;
  }
}
