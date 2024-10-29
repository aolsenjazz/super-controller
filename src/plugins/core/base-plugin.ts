import { Serializable } from '../../shared/serializable';
import type { MessageProcessor, MessageProcessorMeta } from '../types';
import { MessageTransport } from '../types';
import { generateId } from './plugin-utils';

export interface PluginDTO extends Serializable {
  id: string;
  parentId: string;
  title: string;
  description: string;
  on: boolean;
  collapsed: boolean;
  type: 'device' | 'input';
}

/**
 * Classes overriding `BasePlugin` live inside the main process and are responsible for their own:
 *
 * - state management
 * - ipc communications
 * - de/serialization
 *
 * Every plugin is stored in a subfolder of the plugins directory, which must contain a manifest.json
 * file, used to identify plugin subcomponents (UI, BasePlugin, IPC).
 *
 * Plugin manifests are dynamically loaded and then used futher to dynamically load subcomponents.
 */
export abstract class BasePlugin<T extends PluginDTO = PluginDTO>
  implements MessageProcessor
{
  public readonly id: string;

  public readonly title: string;

  public readonly description: string;

  public readonly parentId: string;

  public on = true;

  public collapsed = false;

  public abstract type: 'input' | 'device';

  constructor(
    title: string,
    description: string,
    parentId: string,
    id?: string
  ) {
    this.title = title;
    this.description = description;
    this.parentId = parentId;
    this.id = id || generateId(this.title);
  }

  public abstract init(loopbackTransport: MessageTransport): void;

  public abstract process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined;

  /**
   * Tells a plugin to apply the changes which were made to it. Returns whether or not
   * the parent input/device should be resynced with remove devices
   */
  public abstract applyDTO(dto: T): boolean;

  public toDTO(): T {
    return {
      id: this.id,
      parentId: this.parentId,
      title: this.title,
      description: this.description,
      on: this.on,
      collapsed: this.collapsed,
      type: this.type,
    } as T;
  }
}
