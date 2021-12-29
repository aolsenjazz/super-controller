/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */

import path from 'path';
import { URL } from 'url';

import { Project } from '@shared/project';

const fs = require('fs');

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
 * @param { string } filePath The path to the JSON file
 * @return { object } The parsed object
 */
export function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath));
}

/**
 * Loads the file at given path. *DO NOT* invoke from frontend
 *
 * @param filePath The path to the file
 * @returns the project
 */
export function projectFromFile(filePath: string) {
  const jsonString = fs.readFileSync(filePath);
  return Project.fromJSON(jsonString);
}
