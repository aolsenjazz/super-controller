import { MessageProcessorMeta } from '../../message-processor';
import { getQualifiedInputId } from '../../util';
import { BaseInputConfig, InputDTO, InputState } from './base-input-config';

export interface SwitchState extends InputState {
  step: NumberArrayWithStatus;
}

export interface SwitchDTO extends InputDTO {
  steps: Map<string, NumberArrayWithStatus>;
}

export class SwitchConfig extends BaseInputConfig<SwitchDTO> {
  public toDTO(): SwitchDTO {
    return {
      ...this.toDTO(),
      className: this.constructor.name,
      steps: new Map(), // TODO:
    };
  }

  public process(
    msg: NumberArrayWithStatus,
    _meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined {
    return msg;
  }

  public init() {
    // noop, for now
  }

  handleMessage(msg: NumberArrayWithStatus): NumberArrayWithStatus | undefined {
    // TODO:
    return msg;
  }

  applyStub(icicle: SwitchDTO) {
    Array.from(icicle.steps.keys()).forEach((_k) => {
      // const asArr = JSON.parse(k);
      // const ma = create(stub.steps.get(k)!);
      // this.outputPropagator.setStep(asArr, ma);
      // TODO:
    });
  }

  isOriginator(_msg: NumberArrayWithStatus) {
    // const ma = msg instanceof MidiArray ? msg : create(msg);

    // return Array.from(this.outputPropagator.steps.keys()).includes(
    //   JSON.stringify(ma.array)
    // ); TODO:
    return false;
  }

  get type() {
    return 'switch' as const;
  }

  get state() {
    return {
      step: [144, 0, 0] as NumberArrayWithStatus,
    };
  }

  public get id(): string {
    // const def = this.outputPropagator.defaultStep;
    // return `switch.${def[1]}`;
    // TODO:
    return 'Switch';
  }

  public get qualifiedId(): string {
    return getQualifiedInputId(this.deviceId, this.id);
  }
}
