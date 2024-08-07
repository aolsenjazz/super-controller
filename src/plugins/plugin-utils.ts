import randomstring from 'randomstring';
import fs from 'fs';
import path from 'path';

import { getPluginsPath } from '@main/util-main';

import type { BasePlugin } from './base-plugin';
import type { BasePluginStatic } from './base-plugin-static';

/**
 * Convenience function to generate a pseudo-random string for identifying
 * and differentiating plugin instances
 */
export function generateId(title: string) {
  return `${title}-${randomstring.generate()}`;
}

/**
 * Returns all available device plugins, sorted alphabetically
 */
export function allDevicePlugins() {
  const pluginsPath = getPluginsPath();
  return (
    fs
      .readdirSync(path.join(pluginsPath, 'device-plugins'), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) =>
        path.join(pluginsPath, 'device-plugins', dirent.name, 'index.ts')
      )
      // eslint-disable-next-line global-require, import/no-dynamic-require
      .map((p) => require(p).default as BasePlugin & BasePluginStatic)
      .sort((a, b) => a.TITLE().localeCompare(b.TITLE()))
  );
}

/**
 * Returns all available device plugins, sorted alphabetically
 */
export function allInputPlugins() {
  const pluginsPath = getPluginsPath();
  return (
    fs
      .readdirSync(path.join(pluginsPath, 'input-plugins'), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) =>
        path.join(pluginsPath, 'input-plugins', dirent.name, 'index.ts')
      )
      // eslint-disable-next-line global-require, import/no-dynamic-require
      .map((p) => require(p).default as BasePlugin & BasePluginStatic)
      .sort((a, b) => a.TITLE().localeCompare(b.TITLE()))
  );
}

/**
 * Returns the `BasePlugin` superclass for given `title`
 */
export function getDevicePlugin(title: string) {
  return allDevicePlugins().filter((p) => p.TITLE() === title)[0];
}

/**
 * Returns the `BasePlugin` superclass for given `title`
 */
export function getInputPlugin(title: string) {
  return allInputPlugins().filter((p) => p.TITLE() === title)[0];
}
