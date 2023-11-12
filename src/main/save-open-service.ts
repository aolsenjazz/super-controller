import { dialog, app } from 'electron';
import fs from 'fs';
import path from 'path';

import { Project } from '@shared/project';
import { stringify } from '@shared/util';

import Store from 'electron-store';

const SAVE_DIR = 'dir';
const store = new Store();

/**
 * Returns the most recent save/open location or Desktop
 *
 * @returns Recommended save/open dir
 */
function recommendedDir(): string {
  return store.get(SAVE_DIR, app.getPath('desktop')) as string;
}

/**
 * Convenience class for opening, saving, remembering convenient paths.
 */
class SaveOpenServiceSingleton {
  /* The most-recently-used folder path */
  currentPath?: string;

  private static instance: SaveOpenServiceSingleton;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): SaveOpenServiceSingleton {
    if (!SaveOpenServiceSingleton.instance) {
      SaveOpenServiceSingleton.instance = new SaveOpenServiceSingleton();
    }
    return SaveOpenServiceSingleton.instance;
  }

  /**
   * Write current project to disk at `project`s default path. If no such default path
   * exists, create a saveAs dialog
   *
   * @param project The project to save
   * @returns resolves once save complete/canceled
   */
  save(project: Project): Promise<boolean> {
    if (!this.currentPath) return this.saveAs(project);
    return new Promise<boolean>((resolve) => resolve(this.saveSync(project)));
  }

  /**
   * Prompts user that they're about to lose progress if necessary.
   * If a file has already been opened/saved, saves automatically to the same path.
   * Otherwise, opens a save dialog.
   *
   * @param project The project to save
   * @returns true if save was complete, false if canceled
   */
  saveSync(project: Project): boolean {
    if (this.currentPath) {
      fs.writeFileSync(this.currentPath, stringify(project), {});
      app.addRecentDocument(this.currentPath);
      return true;
    }

    const filePath = dialog.showSaveDialogSync({
      filters: [{ name: 'SuperController', extensions: ['controller'] }],
      defaultPath: path.join(recommendedDir(), 'Untitled Project'),
    });

    if (filePath === undefined) throw new Error('aborted');

    store.set(SAVE_DIR, path.parse(filePath).dir);
    this.currentPath = filePath;

    return this.saveSync(project);
  }

  /**
   * Create a save dialog, update `project` `path` and `name`, write to disk.
   *
   * @param project The project to save
   * @returns resolves once the save is complete or canceled
   */
  saveAs(project: Project): Promise<boolean> {
    const suggestedName = this.currentPath || 'Untitled Project';

    return dialog
      .showSaveDialog({
        filters: [{ name: 'SuperController', extensions: ['controller'] }],
        defaultPath: path.join(recommendedDir(), suggestedName),
      })
      .then((result) => {
        if (result.canceled) throw new Error('aborted');
        if (!result.filePath) throw new Error(`filePath must not be falsy`);

        const { filePath } = result;
        store.set(SAVE_DIR, path.parse(filePath).dir);
        this.currentPath = filePath;
        return project;
      })
      .then(() => this.save(project));
  }

  /**
   * Shows an open dialog to the user
   *
   * @returns Promise<string> promise which resolves with the filePath
   */
  open(): Promise<string> {
    return dialog
      .showOpenDialog({
        defaultPath: recommendedDir(),
        filters: [{ name: 'SuperController', extensions: ['controller'] }],
      })
      .then((result) => {
        if (result.canceled) throw new Error('aborted');

        const filePath = result.filePaths[0];
        store.set(SAVE_DIR, path.parse(filePath).dir);
        this.currentPath = filePath;

        return filePath;
      });
  }
}

export const SaveOpenService = SaveOpenServiceSingleton.getInstance();
