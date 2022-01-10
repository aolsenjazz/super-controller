/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import { Project } from '@shared/project';

import { PortPair } from './ports/port-pair';

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
 * Loads the file at given path. *DO NOT* invoke from frontend
 *
 * @param filePath The path to the file
 * @returns the project
 */
export function projectFromFile(filePath: string) {
  const jsonString = fs.readFileSync(filePath, 'utf8');
  return Project.fromJSON(jsonString);
}

/**
 * Returns an array of two array. Element at idx 0 is an array of `PortPair`s which are present
 * in `pairs1` and not `pairs2`, while element at idx 1 is the inverse
 *
 * @param pairs1 The first list
 * @param pairs2 the second list
 * @param stripPrefix Should the 'SC ' prefix be stripped from SuperController-created virtual ports?
 *
 * @returns [portPairsPresentIn1AndNot2[], portPairsPresentIn2AndNot1[]]
 */
export function getDiff(
  pairs1: PortPair[],
  pairs2: PortPair[],
  stripPrefix: boolean
) {
  let ids1: string[];
  let ids2: string[];

  if (stripPrefix) {
    ids1 = pairs1.map((pair) => pair.id.replace('SC ', ''));
    ids2 = pairs2.map((pair) => pair.id.replace('SC ', ''));
  } else {
    ids1 = pairs1.map((pair) => pair.id);
    ids2 = pairs2.map((pair) => pair.id);
  }

  const diffPairs1 = ids1
    .filter((id) => !ids2.includes(id))
    .map((id) => ids1.indexOf(id))
    .map((idx) => pairs1[idx]);
  const diffPairs2 = ids2
    .filter((id) => !ids1.includes(id))
    .map((id) => ids2.indexOf(id))
    .map((idx) => pairs2[idx]);

  return [diffPairs1, diffPairs2];
}
