import { byteToStatusString } from '@shared/midi-util';

import { InputType, MonoInteractiveDriver } from '../../driver-types';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { SliderState } from './slider-config';
import type { MonoInputDTO } from './mono-input-dto';

/**
 * It should be noted that while `PitchbendConfig` extends `MonoInputConfig`, pitchbend
 * messages do not have a notion of `number` and therefore `config.number` and
 * `config.defaults.number` are a misnomer. Normally, the value at the number-index of a
 * pitchbend MIDI message array would be the MSB of the pitchbend value, but because of how
 * create configs from drivers, `config.number` is instead just assigned a meaningless number.
 */
export class PitchbendConfig extends MonoInputConfig {
  public defaults: InputDefault;

  constructor(
    deviceId: string,
    nickname: string,
    driver: MonoInteractiveDriver
  ) {
    super(deviceId, nickname, [], driver);

    this.defaults = {
      number: driver.number,
      channel: driver.channel,
      statusString: driver.status,
      response: driver.response,
    };
  }

  public toDTO(): MonoInputDTO {
    return {
      ...this.toDTO(),
      className: this.constructor.name,
    };
  }

  isOriginator(msg: NumberArrayWithStatus) {
    if (msg.length === 3) {
      const statusString = byteToStatusString(msg[0]);
      const channel = msg[0] & 0x0f;
      return (
        statusString === this.defaults.statusString &&
        channel === this.defaults.channel
      );
    }

    return false;
  }

  get type(): InputType {
    return 'wheel';
  }

  get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;

    return `${ss}.${c}`;
  }

  get state(): SliderState {
    return {
      value: 0, // TODO:
    };
  }
}
