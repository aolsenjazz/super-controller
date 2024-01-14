import { Project as V6Project } from '@shared/project';
import { parse as v6Parse, stringify as v6Stringify } from '@shared/util';
import { DeviceConfig } from '@shared/hardware-config';

import {
  stringify as v5Stringify,
  parse as v5Parse,
} from './legacy/v5/shared/util';
import { Project as V5Project } from './legacy/v5/shared/project';

import { BaseUpgrade } from './common/base-upgrade';

function upgradeToV6(projString: string) {
  const oldProj = v5Parse<V5Project>(projString);

  const newDevices = oldProj.devices
    .map((d) => v5Stringify(d))
    .map((s) => v6Parse<DeviceConfig>(s));

  const newProj = new V6Project(newDevices, 6);
  return v6Stringify(newProj);
}

export class V5ToV6 extends BaseUpgrade {
  applyUpgrade(v5ProjectString: string) {
    return upgradeToV6(v5ProjectString);
  }

  rollback(freshProjectString: string) {
    return freshProjectString;
  }

  verify(): void {
    throw new Error('cant be arsed');
  }
}
