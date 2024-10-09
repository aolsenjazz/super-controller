import type { Color } from '@shared/driver-types/color';
import type { FxDriver } from '@shared/driver-types/fx-driver';
import type {
  InputResponse,
  MonoInteractiveDriver,
} from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { PadDriver } from '@shared/driver-types/input-drivers/pad-driver';
import { MessageProcessorMeta } from '@shared/message-processor';
import { MessageTransport } from '@shared/message-transport';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { sumMidiArrays } from '@shared/util';
import { GateStateManager } from './state-manager/gate-state-manager';
import { StateManager } from './state-manager/state-manager';

export interface BacklightControlDTO extends PluginDTO {
  outputResponse: InputResponse;
  colorBindings: BacklightControlPlugin['colorBindings'];
  fxBindings: BacklightControlPlugin['fxBindings'];
  fxValueBindings: BacklightControlPlugin['fxValueBindings'];
  availableColors: BacklightControlPlugin['availableColors'];
  availableFx: BacklightControlPlugin['availableFx'];
  availableStates: number[];
  state: number;
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
  fxValueBindings: Record<number, MidiNumber[]> = {};

  availableColors: Color[];

  availableFx: FxDriver[];

  constructor(
    title: string,
    description: string,
    driver: MonoInteractiveDriver,
    _dto?: BacklightControlDTO
  ) {
    super(title, description, driver);

    this.stateManager = new GateStateManager(driver as PadDriver);
    this.availableColors = driver.availableColors;
    this.availableFx = driver.availableFx;

    const { availableStates } = this.stateManager;

    if (this.availableColors) {
      availableStates.forEach((s) => this.restoreDefaultColor(s));
    }

    if (this.availableFx) {
      availableStates.forEach((s) => this.restoreDefaultFx(s));
    }
  }

  public init(loopbackTransport: MessageTransport) {
    const color = this.colorBindings[0]?.array;
    const fx = this.fxValueBindings[0];

    const lightMsg =
      color !== undefined && fx !== undefined
        ? sumMidiArrays(color, fx)
        : color;

    // Send the color message, if defined, to the source device
    loopbackTransport.send(lightMsg);
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
      colorBindings: this.colorBindings,
      fxBindings: this.fxBindings,
      fxValueBindings: this.fxValueBindings,
      availableColors: this.availableColors,
      availableFx: this.availableFx,
      availableStates: this.stateManager.availableStates,
      state: this.stateManager.state,
    };
  }

  public applyDTO(dto: BacklightControlDTO): void {
    this.colorBindings = dto.colorBindings;
    this.fxBindings = dto.fxBindings;
    this.fxValueBindings = dto.fxValueBindings;
  }

  public restoreDefaultColor(state: number) {
    const defaultColor = this.availableColors.find((c) => c.default);
    if (defaultColor) this.colorBindings[state] = defaultColor;
  }

  public restoreDefaultFx(state: number) {
    const defaultFx = this.availableFx.find((fx) => fx.isDefault);
    if (defaultFx) this.fxBindings[state] = defaultFx;
  }

  public restoreDefaultFxValue(state: number) {
    const defaultFx = this.availableFx.find((fx) => fx.isDefault);
    if (defaultFx) this.fxValueBindings[state] = defaultFx.defaultVal;
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['supported', 'adapter'];
  }
}
