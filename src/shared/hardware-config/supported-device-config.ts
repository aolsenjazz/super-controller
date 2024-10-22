import { DRIVERS } from '../drivers';
import { MessageProcessorMeta } from '../message-processor';
import { MessageTransport } from '../message-transport';

import { DeviceConfig, DeviceConfigDTO } from './device-config';
import { getQualifiedInputId } from '../util';
import { idForMsg } from '../midi-util';

interface SupportedDeviceConfigDTO extends DeviceConfigDTO {
  inputs: string[];
  className: 'SupportedDeviceConfig';
}

/* Contains device-specific configurations and managed `InputConfig`s */
export class SupportedDeviceConfig extends DeviceConfig<SupportedDeviceConfigDTO> {
  public inputs: string[] = [];

  public toDTO() {
    return {
      ...this.stub(),
      className: 'SupportedDeviceConfig' as const,
      inputs: this.inputs,
      type: 'supported' as const,
    };
  }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    const message = super.process(msg, meta)!;
    const messageIdentifier = idForMsg(msg, false);
    const input = meta.inputProvider.get(
      getQualifiedInputId(this.id, messageIdentifier)
    );

    return input ? input.process(message, meta) : message;
  }

  public init(loopbackTransport: MessageTransport) {
    const driver = DRIVERS.get(this.driverName)!;

    if (driver.throttle) loopbackTransport.applyThrottle(driver.throttle);
    driver.controlSequence.forEach((msg) => loopbackTransport.send(msg)); // run control sequence
  }
}
