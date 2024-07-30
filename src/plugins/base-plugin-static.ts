import { BasePlugin } from './base-plugin';

/**
 * Basic indentifying information for classes extending `BasePlugin`. All plugin
 * classes which extend `BasePlugin` must implement this interface; unfortunately,
 * there's no better way to enfore this to my knowledge.
 */
export interface BasePluginStatic {
  new (): BasePlugin;
  TITLE(): string;
  DESCRIPTION(): string;
}

/**
 * Decorator used to enforce the existence of TITLE and DESCRIPTION static
 * function on classes extending `BasePlugin` class
 */
export function ImplementsBasePluginStatic() {
  return <U extends BasePluginStatic>(constructor: U) => {
    return constructor;
  };
}
