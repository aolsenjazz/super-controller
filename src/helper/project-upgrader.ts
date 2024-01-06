import { Project } from '@shared/project';
import { parse } from '@shared/util';

import { BaseUpgrade } from './common/base-upgrade';
import { V0ToV1 } from './v0-to-v1';
import { V1ToV2 } from './v1-to-v2';
import { V2ToV3 } from './v2-to-v3';
import { V3ToV4 } from './v3-to-v4';
import { V4ToV5 } from './v4-to-v5';

const upgradeConstructors = [V0ToV1, V1ToV2, V2ToV3, V3ToV4, V4ToV5];

export function upgradeProject(projectString: string): Project {
  const asObj = JSON.parse(projectString);

  // Set initial version for pre-upgrade-version files
  if (!asObj.version) {
    asObj.version = 0;
  }

  // Early return if the project is already at the current version
  if (asObj.version === Project.CURRENT_VERSION) {
    return parse<Project>(projectString);
  }

  let upgradedProjectString = projectString;

  // Apply sequential updates to Project objects
  for (let i = asObj.version; i < Project.CURRENT_VERSION; i++) {
    const UpgradeClass = upgradeConstructors[i];
    const upgradeInstance: BaseUpgrade = new UpgradeClass();
    upgradedProjectString = upgradeInstance.applyUpgrade(upgradedProjectString);
  }

  // Parse the final upgraded project string into a Project object
  return parse<Project>(upgradedProjectString);
}
