// import {
//   AdapterDeviceConfig,
//   AnonymousDeviceConfig,
//   DeviceConfig,
//   SupportedDeviceConfig,
// } from '@shared/hardware-config';
// import { BasePlugin } from '@shared/plugin-core/base-plugin';

import { BaseUpgrade } from './common/base-upgrade';
// import {
//   AdapterDeviceConfig as V5AdapterDeviceConfig,
//   SupportedDeviceConfig as V5SupportedDeviceConfig,
//   AnonymousDeviceConfig as V5AnonymousDeviceConfig,
//   DeviceConfig as V5DeviceConfig,
// } from './legacy/v5/shared/hardware-config';

// function upgradeDeviceConfig(d: V5DeviceConfig, _plugins: BasePlugin[]) {
//   let newDev: DeviceConfig;
//   if (d instanceof V5AnonymousDeviceConfig) {
//     newDev = new AnonymousDeviceConfig(
//       d.portName,
//       d.siblingIndex,
//       d.nickname,
//       []
//     );
//   } else if (d instanceof V5SupportedDeviceConfig) {
//     // TODO: add plugins to constructor
//     newDev = new SupportedDeviceConfig(
//       d.portName,
//       d.driverName,
//       d.siblingIndex,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       d.inputs as any,
//       d.nickname
//     );
//   } else {
//     const asAdapt = d as V5AdapterDeviceConfig;
//     const oldChild = asAdapt.child!;
//     // TODO: add plugins to this contructor
//     const newChild = new SupportedDeviceConfig(
//       oldChild.portName,
//       oldChild.driverName,
//       oldChild.siblingIndex,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       oldChild.inputs as any,
//       oldChild.nickname
//     );

//     // TODO: add plugins to contructor
//     newDev = new AdapterDeviceConfig(
//       asAdapt.portName,
//       asAdapt.driverName,
//       asAdapt.siblingIndex,
//       newChild
//     );
//   }

//   return newDev;
// }

function upgradeToV6(_projString: string) {
  // const oldProj = v5Parse<V5Project>(projString);

  // const newDevices = oldProj.devices
  //   .map((d) => {
  //     const shareSustain = new ShareSustainPlugin(
  //       'Share Sustain',
  //       'Temp description',
  //       d.shareSustain
  //     );
  //     const newDevice = upgradeDeviceConfig(d, [shareSustain]);
  //     return JSON.stringify(newDevice);
  //   })
  //   .map((s) => JSON.parse(s));

  return '';
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
