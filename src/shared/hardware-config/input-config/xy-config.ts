import { XYDriver } from '../../driver-types/input-drivers/xy-driver';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import { BaseInputConfig, InputDTO } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';
import { PluginProvider } from '../../plugin-provider';
import { BaseInteractiveInputDriver } from '../../../plugins/types';
import { BaseInputPlugin } from '../../../plugins/core/base-input-plugin';

export interface XYDTO extends InputDTO {
  x: MonoInputDTO;
  y: MonoInputDTO;
}

export class XYConfig extends BaseInputConfig<XYDTO, XYDriver> {
  public x: SliderConfig | PitchbendConfig;

  public y: SliderConfig | PitchbendConfig;

  public type = 'xy' as const;

  constructor(
    deviceId: string,
    nickname: string,
    driver: XYDriver,
    dto?: XYDTO,
  ) {
    super(deviceId, nickname, driver, []);

    const XConfig =
      driver.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
    const YConfig =
      driver.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

    let xPlugins: string[] = [];
    let yPlugins: string[] = [];

    if (dto) {
      xPlugins = dto.x.plugins;
      yPlugins = dto.y.plugins;
    }

    this.x = new XConfig(deviceId, '', xPlugins, driver.x);
    this.y = new YConfig(deviceId, '', yPlugins, driver.y);
  }

  public init() {
    // noop, for now
  }

  public applyStub(s: XYDTO): void {
    super.applyStub(s);
  }

  public initDefaultPlugins(provider: PluginProvider): void {
    this.x.initDefaultPlugins(provider);
    this.y.initDefaultPlugins(provider);
  }

  public initPluginsFromDTO(
    createPlugin: (driver: BaseInteractiveInputDriver) => BaseInputPlugin,
  ) {
    return [createPlugin(this.x.driver), createPlugin(this.y.driver)];
  }

  public toDTO(): XYDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      x: this.x.toDTO(),
      y: this.y.toDTO(),
    };
  }

  public getPlugins() {
    return [...this.x.getPlugins(), ...this.y.getPlugins()];
  }

  public process(): NumberArrayWithStatus | undefined {
    throw new Error(
      'It is not the job of the XY config to pass midi messages to its children',
    );
  }
}
