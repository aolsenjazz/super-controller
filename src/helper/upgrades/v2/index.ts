/* eslint-disable no-bitwise */
import { Project } from '@shared/project';
import {
  DeviceConfig,
  AdapterDeviceConfig,
  SupportedDeviceConfig,
  InputConfig,
  ColorImpl,
  AnonymousDeviceConfig,
} from '@shared/hardware-config';
import { stringify, parse } from '@shared/util';
import { InputResponse } from '@shared/driver-types';
import {
  OverrideablePropagator,
  ColorConfigPropagator,
} from '@shared/propagators';

import {
  AdapterDeviceConfig as V2AdapterConfig,
  SupportedDeviceConfig as V2SupportedDeviceConfig,
  InputConfig as V2InputConfig,
} from './hardware-config';
import { Project as V2Project } from './project';
import { parse as v2Parse, stringify as v2Stringify } from './util';

function convertInputs(ins: V2InputConfig[]) {
  return ins.map((i) => {
    const defs = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      statusString: i.default.eventType || (i.default as any).statusString,
      response: i.default.response,
      number: i.default.number,
      channel: i.default.channel,
    };

    const colors = i.availableColors.map((c) => {
      const arr = JSON.parse(JSON.stringify(c.array));
      if (i.availableFx.length > 0) {
        arr[0] &= 0xf0;
      }

      return new ColorImpl({
        array: arr,
        name: c.name,
        string: c.string,
        default: c.isDefault,
        modifier: c.modifier,
      });
    });

    const opStr = v2Stringify(i.outputPropagator);
    const newOp =
      parse<OverrideablePropagator<InputResponse, InputResponse>>(opStr);

    const dpStr = v2Stringify(i.devicePropagator);
    const newDp = parse<ColorConfigPropagator>(dpStr);
    // if this input has available fx, change channel to 0 for all colors
    if (i.availableFx.length > 0) {
      const cImpl0 = newDp.getColor(0);
      if (cImpl0) {
        const newArr0 = cImpl0.array;
        newArr0[0] &= 0xf0;
        const newC0 = new ColorImpl({
          array: newArr0,
          name: cImpl0.name,
          string: cImpl0.string,
          default: cImpl0.isDefault,
          modifier: cImpl0.modifier,
        });
        newDp.setColor(0, newC0);

        // now set fx = defaultFx for non-Off colors
        if (cImpl0.name !== 'Off') {
          const defFx = i.defaultFx;

          if (defFx && newDp.getFx(0) === undefined) {
            newDp.setFx(0, defFx.defaultVal);
          }
        }
      }

      const cImpl1 = newDp.getColor(0);
      if (cImpl1) {
        const newArr0 = cImpl1.array;
        newArr0[0] &= 0xf0;
        const newC1 = new ColorImpl({
          array: newArr0,
          name: cImpl1.name,
          string: cImpl1.string,
          default: cImpl1.isDefault,
          modifier: cImpl1.modifier,
        });
        newDp.setColor(1, newC1);

        // now set fx = defaultFx for non-Off colors
        if (cImpl1.name !== 'Off') {
          const defFx = i.defaultFx;

          if (defFx && newDp.getFx(1) === undefined) {
            newDp.setFx(1, defFx.defaultVal);
          }
        }
      }
    }

    return new InputConfig(
      defs,
      colors,
      i.availableFx,
      i.overrideable,
      i.type,
      i.value,
      newOp,
      newDp,
      i.knobType,
      i.valueType,
      i.nickname
    );
  });
}

export function upgradeToV3(projectString: string) {
  const project = v2Parse<V2Project>(projectString);

  const configs: DeviceConfig[] = [];
  project.devices.forEach((d) => {
    if (d instanceof V2AdapterConfig) {
      const newChild = new SupportedDeviceConfig(
        d.child!.name,
        d.child!.siblingIndex,
        d.child!.shareSustain,
        convertInputs(d.child!.inputs),
        d.child!.nickname,
        d.child!.keyboardDriver
      );
      const newConfig = new AdapterDeviceConfig(
        d.name,
        d.siblingIndex,
        newChild
      );

      configs.push(newConfig);
    } else if (d instanceof V2SupportedDeviceConfig) {
      const newConfig = new SupportedDeviceConfig(
        d.name,
        d.siblingIndex,
        d.shareSustain,
        convertInputs(d.inputs),
        d.nickname,
        d.keyboardDriver
      );
      configs.push(newConfig);
    } else {
      configs.push(d as AnonymousDeviceConfig);
    }
  });

  const newProject = new V2Project(configs, Project.CURRENT_VERSION);
  return stringify(newProject);
}
