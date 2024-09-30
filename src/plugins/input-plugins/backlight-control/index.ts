import type {
  Color,
  FxDriver,
  InputResponse,
  MonoInteractiveDriver,
  PadDriver,
} from '@shared/driver-types';
import { MessageProcessorMeta } from '@shared/message-processor';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { sumMidiArrays } from '@shared/util';
import { GateStateManager } from './state-manager/gate-state-manager';
import { StateManager } from './state-manager/state-manager';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlDTO extends PluginDTO {
  outputResponse: InputResponse;
}

export default class BacklightControlPlugin extends BaseInputPlugin<BacklightControlDTO> {
  stateManager: StateManager;

  /**
   * Maps `Color` objects to a given state
   */
  colorBindings: Record<number, Color> = {};

  /**
   * Maps `FxDriver` objects to a given state
   */
  fxBindings: Record<number, FxDriver> = {};

  /**
   * Maps the current value of the fx for this state. Needs to be separate from
   * the mapped `fxBindings` because fx messages can have different values for each
   * fx style.
   */
  fxValueBindings: Record<number, NumberArrayWithStatus> = {};

  constructor(
    title: string,
    description: string,
    driver: MonoInteractiveDriver,
    dto?: BacklightControlDTO
  ) {
    super(title, description, driver);

    this.stateManager = new GateStateManager(driver as PadDriver);
  }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    const state = this.stateManager.process(msg);
    const color = this.colorBindings[state]?.array;
    const fx = this.fxValueBindings[state];

    const lightMsg =
      color !== undefined && fx !== undefined
        ? sumMidiArrays(color, fx)
        : color;

    // Send the color message, if defined, to the source device
    meta.loopbackTransport.send(lightMsg);

    return msg; // propgate the source message
  }

  public toDTO(): BacklightControlDTO {
    return {
      ...super.toDTO(),
    };
  }

  public applyIcicle(dto: BacklightControlDTO): void {
    super.applyDTO(dto);
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
