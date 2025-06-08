import type { MessageProcessorMeta } from '../../types';
import type { PluginDTO } from '../../core/base-plugin';
import { BaseDevicePlugin } from '../../core/base-device-plugin';

import Manifest from './manifest';

const CC = 176;
const SUSTAIN_NUM = 64;

export interface ShareSustainDTO extends PluginDTO {
  sustainTargets: string[];
}

export default class ShareSustainPlugin extends BaseDevicePlugin<ShareSustainDTO> {
  public sustainTargets: string[] = [];

  protected dataVersion = 1;

  public static override fromDTO(dto: ShareSustainDTO) {
    // the original spec was not design w/migrations in mind
    if (dto.dataVersion === undefined) dto.dataVersion = 1;

    return new ShareSustainPlugin(dto.parentId, dto.id, dto.sustainTargets);
  }

  constructor(parentId: string, id?: string, sustainTargets: string[] = []) {
    super(Manifest.title, Manifest.description, parentId, id);
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

  public applyDTO(dto: ShareSustainDTO) {
    this.sustainTargets = dto.sustainTargets;
    return false;
  }
}
