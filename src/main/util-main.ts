/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { app } from 'electron';

import { upgradeProject } from '../helper/project-upgrader';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

/**
 * Loads a JSON file
 *
 * @param filePath The path to the JSON file
 * @returns The parsed object
 */
export function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Loads the file at given path.
 *
 * @param filePath The path to the file
 * @returns the project
 */
export function projectFromFile(filePath: string) {
  const jsonString = fs.readFileSync(filePath, 'utf8');
  return upgradeProject(jsonString);
}

export function getAssetPath(...paths: string[]) {
  // TODO: these can really be moved up to top-level orrrrr to util-main
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
}

export function getPreloadPath() {
  return app.isPackaged
    ? path.join(__dirname, 'preload.js')
    : path.join(__dirname, '../../.erb/dll/preload.js');
}
