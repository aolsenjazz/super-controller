import { MessageProcessorMeta } from '../../types';
import { BaseDevicePlugin } from '../../core/base-device-plugin';
import { PluginDTO } from '../../core/base-plugin';

import { toString } from './util';
import Manifest from './manifest';

const DATA_VERSION = 1;

export interface TranslatorDTO extends PluginDTO {
  overrides: Record<string, NumberArrayWithStatus | undefined>;
  valueIndependencies: Record<string, boolean>;
}

export default class TranslatorPlugin extends BaseDevicePlugin<TranslatorDTO> {
  private overrides: Record<string, NumberArrayWithStatus | undefined> = {};

  private valueIndependencies: Record<string, boolean> = {};

  protected dataVersion = 1;

  public static override fromDTO(dto: TranslatorDTO) {
    // the original spec was not design w/migrations in mind
    if (dto.dataVersion === undefined) {
      dto.dataVersion = 1;

      const valueIndependencies: Record<string, boolean> = {};
      Object.keys(dto.overrides).forEach((k) => {
        valueIndependencies[k] = false;
      });
      dto.valueIndependencies = valueIndependencies;
    }

    return new TranslatorPlugin(
      dto.parentId,
      dto.id,
      dto.overrides,
      dto.valueIndependencies,
    );
  }

  public constructor(
    parentId: string,
    id?: string,
    overrides?: TranslatorPlugin['overrides'],
    valueIndependencies?: Record<string, boolean>,
  ) {
    super(Manifest.title, Manifest.description, parentId, id);

    if (overrides) {
      this.overrides = overrides;
    }

    if (valueIndependencies) {
      this.valueIndependencies = valueIndependencies;
    }
  }

  public init() {}

  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    const valueIndependent = Object.entries(this.valueIndependencies)
      .map(([k, v]) => {
        const newKeys = k.split('.');
        return [[parseInt(newKeys[0], 10), parseInt(newKeys[1], 10)], v] as [
          [number, number],
          boolean,
        ];
      })
      .find(([twoByteKey]) => {
        return twoByteKey[0] === msg[0] && twoByteKey[1] === msg[1];
      });

    if (valueIndependent) {
      // gross, but let's do it
      const override = Object.entries(this.overrides)
        .map(([k, v]) => {
          const newKeys = k.split('.');
          return [[parseInt(newKeys[0], 10), parseInt(newKeys[1], 10)], v] as [
            [number, number],
            NumberArrayWithStatus,
          ];
        })
        .find(([twoByteKey]) => {
          return twoByteKey[0] === msg[0] && twoByteKey[1] === msg[1];
        });

      if (override) {
        return override[1];
      }
    }

    const override = this.overrides[toString(msg)];
    return override || msg;
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
      valueIndependencies: this.valueIndependencies,
    };
  }

  public applyDTO(dto: TranslatorDTO) {
    this.overrides = dto.overrides;
    this.valueIndependencies = dto.valueIndependencies;
    return false;
  }
}
