import { Project as V4Project } from '../v3/project';
import { parse as v4Parse } from '../v3/util';

import { Project } from './shared/project';
import { configFromDriver } from './shared/hardware-config';
import { DRIVERS } from './shared/drivers';
import { stringify } from './shared/util';

export function upgradeToV5(projectString: string) {
  const oldProj = v4Parse<V4Project>(projectString);

  const newDevices = oldProj.devices.map((d) => {
    const driver = DRIVERS.get(d.name)!;
    return configFromDriver(d.name, d.siblingIndex, driver);
  });

  const newProj = new Project(newDevices);
  return stringify(newProj);
}
