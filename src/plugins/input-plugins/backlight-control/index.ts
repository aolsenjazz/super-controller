import type {
  MonoInteractiveDriver,
  MessageProcessorMeta,
  MessageTransport,
  Color,
  FxDriver,
} from '../../types';

import { BaseInputPlugin } from '../../core/base-input-plugin';
import { PluginDTO } from '../../core/base-plugin';
import { sumMidiArrays } from './util';

import { GateStateManager } from './state-manager/gate-state-manager';
import { StateManager } from './state-manager/state-manager';
import { ContinuousStateManager } from './state-manager/continuous-state-manager';
import { TriggerStateManager } from './state-manager/trigger-state-manager';

import Manifest from './manifest';

export interface BacklightControlDTO extends PluginDTO {
  outputResponse: BacklightControlPlugin['stateManager']['outputStrategy'];
  eligibleOutputStrategies: BacklightControlPlugin['stateManager']['eligibleOutputStrategies'];
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

  public static override fromDTO(
    dto: BacklightControlDTO,
    driver: MonoInteractiveDriver
  ) {
    return new BacklightControlPlugin(dto.parentId, driver, dto);
  }

  constructor(
    parentId: string,
    driver: MonoInteractiveDriver,
    dto?: BacklightControlDTO
  ) {
    super(Manifest.title, Manifest.description, parentId, driver, dto?.id);

    this.availableColors = driver.availableColors;
    this.availableFx = driver.availableFx;

    // create stateManager
    if (driver.response === 'gate') {
      this.stateManager = new GateStateManager(driver);
    } else if (driver.response === 'continuous') {
      this.stateManager = new ContinuousStateManager();
    } else {
      this.stateManager = new TriggerStateManager(
        driver.response as 'toggle' | 'constant'
      );
    }

    const { availableStates } = this.stateManager;

    if (this.availableColors) {
      availableStates.forEach((s) => this.restoreDefaultColor(s));
    }

    if (this.availableFx) {
      availableStates.forEach((s) => this.restoreDefaultFx(s));
    }

    if (dto) {
      this.colorBindings = dto.colorBindings;
      this.fxBindings = dto.fxBindings;
      this.fxValueBindings = dto.fxValueBindings;
      this.stateManager.outputStrategy = dto.outputResponse;
    }
  }

  public init(loopbackTransport: MessageTransport) {
    const color = this.colorBindings[this.stateManager.state]?.array;
    const fx = this.fxValueBindings[this.stateManager.state];

    if (color) {
      const lightMsg = fx !== undefined ? sumMidiArrays(color, fx) : color;

      // Send the color message, if defined, to the source device
      loopbackTransport.send(lightMsg);
    }
  }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    const state = this.stateManager.process(msg);

    if (state !== undefined) {
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

    return msg;
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
      eligibleOutputStrategies: this.stateManager.eligibleOutputStrategies,
      outputResponse: this.stateManager.outputStrategy,
    };
  }

  public applyDTO(dto: BacklightControlDTO) {
    if (this.stateManager.outputStrategy !== dto.outputResponse) {
      this.stateManager.outputStrategy = dto.outputResponse;

      this.restoreDefaultColor(0);
      this.restoreDefaultColor(1);
      this.restoreDefaultFx(0);
      this.restoreDefaultFx(1);
      this.restoreDefaultFxValue(0);
      this.restoreDefaultFxValue(1);
    } else {
      this.stateManager.totalStates = Object.keys(dto.colorBindings).length;
      if (this.stateManager.totalStates === this.stateManager.state) {
        this.stateManager.state = 0;
      }

      this.colorBindings = dto.colorBindings;
      this.fxBindings = dto.fxBindings;
      this.fxValueBindings = dto.fxValueBindings;
    }

    return true;
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
}
