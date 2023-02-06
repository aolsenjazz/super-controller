/* eslint-disable @typescript-eslint/no-explicit-any */

// v1 imports
import { Project } from '@shared/project';
import { parse } from '@shared/util';
import { upgradeToV1 } from './upgrades/v1';

const upgradeFns = new Map<number, (projectString: string) => string>();

export function upgradeProject(projectString: string) {
  const asObj = JSON.parse(projectString);
  if (asObj.version === Project.CURRENT_VERSION) {
    return parse<Project>(projectString);
  }

  // saves files originally didn't store any version number
  if (!asObj.version) {
    asObj.version = 0;
  }

  // apply sequential updates to Project objects
  let upgradedProject = projectString;
  for (let i = asObj.version; i < Project.CURRENT_VERSION; i++) {
    upgradedProject = upgradeFns.get(i)!(projectString);
  }

  return parse<Project>(upgradedProject);
}

upgradeFns.set(0, upgradeToV1);
