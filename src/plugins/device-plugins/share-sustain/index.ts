import { BasePlugin } from '@shared/plugin-core/base-plugin';
import { ShareSustainDTO } from './share-sustain-dto';

export default class ShareSustainPlugin extends BasePlugin<ShareSustainDTO> {
  public sustainTargets: string[] = [];

  constructor(
    title: string,
    description: string,
    sustainTargets: string[] = []
  ) {
    super(title, description);
    this.sustainTargets = sustainTargets;
  }

  public process(msg: NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public toDTO(): ShareSustainDTO {
    return {
      ...super.toDTO(),
      sustainTargets: this.sustainTargets,
    };
  }

  public applyDTO(dto: ShareSustainDTO): void {
    super.applyDTO(dto);
    this.sustainTargets = dto.sustainTargets;
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
