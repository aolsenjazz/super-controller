import { Project } from '@shared/project';
import {
  DeviceConfig,
  AdapterDeviceConfig,
  SupportedDeviceConfig,
  InputConfig,
  ColorImpl,
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
      statusString: i.default.eventType,
      response: i.default.response,
      number: i.default.number,
      channel: i.default.channel,
    };

    const colors = i.availableColors.map((c) => {
      return new ColorImpl({
        array: c.array,
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
      configs.push(d);
    }
  });

  const newProject = new V2Project(configs, Project.CURRENT_VERSION);
  return stringify(newProject);
}
