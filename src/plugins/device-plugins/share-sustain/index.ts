import { MessageProcessorMeta } from '@shared/message-processor';
import { BasePlugin } from '@shared/plugin-core/base-plugin';
import { ShareSustainDTO } from './share-sustain-dto';

const CC = 176;
const SUSTAIN_NUM = 64;

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

  public init() {
    // noop
  }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    const { remoteTransports } = meta;

    const statusNibble = msg[0] & 0xf0;
    const number = msg[1];

    if (statusNibble === CC && number === SUSTAIN_NUM) {
      this.sustainTargets
        .map((t) => remoteTransports.get(t))
        .filter((transport) => transport !== undefined)
        .forEach((transport) => {
          transport!.send(msg);
        });
    }

    return msg;
  }

  public toDTO(): ShareSustainDTO {
    return {
      ...super.toDTO(),
      sustainTargets: this.sustainTargets,
    };
  }

  public applyDTO(dto: ShareSustainDTO): void {
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
