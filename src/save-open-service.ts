import { dialog, app } from 'electron';

import { Project } from './project';

const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const SAVE_DIR = 'dir';
const store = new Store();

/** Returns the most recent save/open location or Desktop */
function recommendedDir(): string {
  return store.get(SAVE_DIR, app.getPath('desktop'));
}

export class SaveOpenService {
  currentPath?: string;

  /**
   * Write current project to disk at `project`s default path without giving the user a save dialog.
   */
  save(project: Project): Promise<Project> {
    if (!this.currentPath) {
      return this.saveAs(project);
    }

    const filePath = path.join(recommendedDir(), project.name);

    return new Promise<Project>((resolve) => {
      fs.writeFile(filePath, project.toJSON(false), {}, () => {
        app.addRecentDocument(filePath);
        resolve(project);
      });
    });
  }

  saveSync(project: Project): boolean {
    if (this.currentPath) {
      const filePath = path.join(recommendedDir(), project.name);

      fs.writeFileSync(filePath, project.toJSON(false), {});
      app.addRecentDocument(filePath);
      return true;
    }

    const filePath = dialog.showSaveDialogSync({
      filters: [{ name: 'SuperController', extensions: ['controller'] }],
      defaultPath: path.join(recommendedDir(), project.name),
    });

    if (filePath === undefined) return false;

    store.set(SAVE_DIR, path.parse(filePath).dir);
    project.name = path.parse(filePath).base;
    this.currentPath = filePath;

    return this.saveSync(project);
  }

  /**
   * Create a save dialog, update `project` `path` and `name`, write to disk.
   */
  saveAs(project: Project): Promise<Project> {
    return dialog
      .showSaveDialog({
        filters: [{ name: 'SuperController', extensions: ['controller'] }],
        defaultPath: path.join(recommendedDir(), project.name),
      })
      .then((result) => {
        if (result.canceled) throw new Error('aborted');

        const filePath = result.filePath!;
        store.set(SAVE_DIR, path.parse(filePath).dir);
        this.currentPath = filePath;
        project.name = path.parse(filePath).base;
        return project;
      })
      .then(() => this.save(project));
  }

  open() {
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
        const project = Project.fromFile(filePath);

        return project;
      });
  }
}
