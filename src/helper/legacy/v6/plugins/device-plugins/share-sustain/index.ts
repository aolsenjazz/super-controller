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

  public static override fromDTO(dto: ShareSustainDTO) {
    return new ShareSustainPlugin(dto.parentId, dto.sustainTargets);
  }

  constructor(parentId: string, sustainTargets: string[] = []) {
    super(Manifest.title, Manifest.description, parentId);
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
