import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { DeviceConfig } from './device-config';

@Revivable.register
export class AnonymousDeviceConfig extends DeviceConfig {
  // TODO: This likely should be made private - accessing this from outside of this class is smelly
  readonly overrides: Map<string, MidiArray>;

  isAdapter = false;

  constructor(
    name: string,
    siblingIndex: number,
    overrides: Map<string, MidiArray>,
    shareSustain: string[],
    nickname?: string
  ) {
    super(name, siblingIndex, false, shareSustain, nickname);

    this.overrides = overrides;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.name,
        this.siblingIndex,
        this.overrides,
        this.shareSustain,
        this.nickname,
      ],
    };
  }

  applyOverrides(msg: MidiArray) {
    const valueNegatedMsg = create([msg[0], msg[1]]);

    const id = JSON.stringify(valueNegatedMsg.array);
    const override = this.overrides.get(id);

    return override ? create([override[0], override[1], msg[2]]) : msg;
  }

  getResponse() {
    return undefined;
  }

  /**
   * TODO: Rename this method. It's a misnomer to say that we're overriding an input because
   * it's not always a one-to-one relationship between inputs and overrides
   *
   * Set the override message to be propagated from SuperController when the given input is received.
   * Value-independent; values are propagated normally and cannot be overriden
   */
  overrideInput(
    targetInput: MidiArray,
    newStatus: StatusString | StatusByte,
    newChannel: Channel,
    newNumber: MidiNumber
  ) {
    const valueNegatedTarget = [...targetInput];
    valueNegatedTarget[2] = 0;
    const override = create(newStatus, newChannel, newNumber, 0);
    this.overrides.set(JSON.stringify(valueNegatedTarget), override);
  }

  /**
   * TODO: Maybe it would be beneficial to give this input notion a proper name - something like "signal"
   * i.e. overrides are applied to signals. cause it's not necesaarily that it's a one-to-one relation
   * between inputs and overrides
   *
   * Returns a midi tuplet with whatever overriden values have been set for the given message.
   * *NOTE* that the value in the returned MIDI tuplet will be 0 because overrides are set
   * independently of value
   */
  getOverride(input: MidiArray) {
    const valueNegatedMsg = [...input];
    valueNegatedMsg[2] = 0;
    return this.overrides.get(JSON.stringify(valueNegatedMsg));
  }
}
