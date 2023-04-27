import { ContinuousPropagator } from '@shared/propagators';
import { InteractiveInputDriver } from '@shared/driver-types';
import { SliderConfig } from './slider-config';

export class XYConfig extends SliderConfig {
  static fromDriver(d: InteractiveInputDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const prop = new ContinuousPropagator(
      'continuous',
      d.status,
      d.number,
      d.channel
    );

    return new XYConfig(def, prop);
  }
}
