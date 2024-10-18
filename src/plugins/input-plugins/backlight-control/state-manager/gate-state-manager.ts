import { PadDriver } from '@shared/driver-types/input-drivers/pad-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { msgIdentityEquals } from '@shared/util';

import { StateManager } from './state-manager';

export class GateStateManager extends StateManager {
  public mode: 'gate' | 'trigger' = 'gate';

  public totalStates: number = 2;

  public state: number = 0;

  // The expected message from the device when the pad/button is pressed
  private triggerSource: NumberArrayWithStatus;

  constructor(driver: PadDriver) {
    super();

    const { status, channel, number } = driver;

    const triggerStatus =
      status === 'noteon/noteoff' ? 'noteon' : 'controlchange';
    const triggerStatusNibble = statusStringToNibble(triggerStatus) | channel;
    const triggerStatusByte = (triggerStatusNibble | channel) as StatusByte;

    this.triggerSource = [triggerStatusByte, number, 127];
  }

  process(msg: NumberArrayWithStatus) {
    // only respond to "presss" events if in trigger mode
    if (this.mode === 'trigger' && msgIdentityEquals(msg, this.triggerSource)) {
      this.state = this.getNextState();
    } else {
      this.state = msgIdentityEquals(msg, this.triggerSource) ? 1 : 0;
    }

    return this.state;
  }

  getNextState(): number {
    return this.state === this.totalStates - 1 ? 0 : this.state + 1;
  }
}
