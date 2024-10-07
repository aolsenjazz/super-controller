import { InputRegistry } from '@main/input-registry';
import { DRIVERS } from '@shared/drivers';
import { MessageProcessorMeta } from '@shared/message-processor';
import { MessageTransport } from '@shared/message-transport';
import { idForMsg } from '@shared/midi-util';
import {
  DeviceDriver,
  InputDriver,
  InteractiveInputDriver,
} from '../driver-types';

import { DeviceConfig, DeviceConfigDTO } from './device-config';
import { create } from './input-config';
import { inputIdFromDriver, getQualifiedInputId } from '../util';

interface SupportedDeviceConfigDTO extends DeviceConfigDTO {
  inputs: string[];
  className: 'SupportedDeviceConfig';
}

/* Contains device-specific configurations and managed `InputConfig`s */
export class SupportedDeviceConfig extends DeviceConfig<SupportedDeviceConfigDTO> {
  public inputs: string[] = [];

  public static fromDriver(
    portName: string,
    siblingIndex: number,
    driver: DeviceDriver
  ) {
    const newConfig = new SupportedDeviceConfig(
      portName,
      driver.name,
      siblingIndex,
      driver.inputGrids.flatMap((g) => g.inputs),
      undefined
    );

    return newConfig;
  }

  constructor(
    name: string,
    driverName: string,
    siblingIndex: number,
    inputs: InputDriver[],
    nickname?: string
  ) {
    super(name, driverName, siblingIndex, nickname);

    // initialize inputs
    inputs
      .filter((i) => i.interactive)
      .map((i) => i as InteractiveInputDriver)
      .forEach((i) => {
        const input = create(this.id, i);
        InputRegistry.register(input.qualifiedId, input);
        this.inputs.push(`${inputIdFromDriver(i)}`);
      });
  }

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
    const messageIdentifier = idForMsg(msg, true);
    const input = InputRegistry.get(
      getQualifiedInputId(this.id, messageIdentifier)
    );
    return input ? input.process(message, meta) : message;
  }

  public init(loopbackTransport: MessageTransport) {
    const driver = DRIVERS.get(this.driverName)!;

    if (driver.throttle) loopbackTransport.applyThrottle(driver.throttle);
    driver.controlSequence.forEach((msg) => loopbackTransport.send(msg)); // run control sequence

    // driver.inputGrids // init default colors if they exist
    //   .flatMap((ig) => ig.inputs)
    //   .forEach((i) => {
    //     if (i.interactive && i.type !== 'xy') {
    //       i.availableColors
    //         .filter((c) => c.default === true)
    //         .forEach((c) => pair.send(c.array));
    //     }
    //   });
  }
}
