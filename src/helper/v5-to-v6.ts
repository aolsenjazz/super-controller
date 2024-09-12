import { Project as V6Project } from '@shared/project';
import {
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
  DeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { BasePlugin } from '@shared/plugin-core/base-plugin';

import ShareSustainPlugin from '../plugins/device-plugins/share-sustain';
import { parse as v5Parse } from './legacy/v5/shared/util';
import { Project as V5Project } from './legacy/v5/shared/project';

import { BaseUpgrade } from './common/base-upgrade';
import {
  AdapterDeviceConfig as V5AdapterDeviceConfig,
  SupportedDeviceConfig as V5SupportedDeviceConfig,
  AnonymousDeviceConfig as V5AnonymousDeviceConfig,
  DeviceConfig as V5DeviceConfig,
} from './legacy/v5/shared/hardware-config';

function upgradeDeviceConfig(d: V5DeviceConfig, plugins: BasePlugin[]) {
  let newDev: DeviceConfig;
  if (d instanceof V5AnonymousDeviceConfig) {
    newDev = new AnonymousDeviceConfig(
      d.portName,
      d.siblingIndex,
      d.nickname,
      plugins
    );
  } else if (d instanceof V5SupportedDeviceConfig) {
    // TODO: add plugins to constructor
    newDev = new SupportedDeviceConfig(
      d.portName,
      d.driverName,
      d.siblingIndex,
      d.inputs,
      d.nickname
    );
  } else {
    const asAdapt = d as V5AdapterDeviceConfig;
    const oldChild = asAdapt.child!;
    // TODO: add plugins to this contructor
    const newChild = new SupportedDeviceConfig(
      oldChild.portName,
      oldChild.driverName,
      oldChild.siblingIndex,
      oldChild.inputs,
      oldChild.nickname
    );

    // TODO: add plugins to contructor
    newDev = new AdapterDeviceConfig(
      asAdapt.portName,
      asAdapt.driverName,
      asAdapt.siblingIndex,
      newChild
    );
  }

  return newDev;
}

function upgradeToV6(projString: string) {
  const oldProj = v5Parse<V5Project>(projString);

  const newDevices = oldProj.devices
    .map((d) => {
      const shareSustain = new ShareSustainPlugin(d.shareSustain);
      const newDevice = upgradeDeviceConfig(d, [shareSustain]);
      return v6Stringify(newDevice);
    })
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
