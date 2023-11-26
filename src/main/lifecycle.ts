import { app } from 'electron';
import os from 'os';

import { wp } from './window-provider';
import {
  ProjectProvider as pp,
  ProjectProviderEvent,
} from './project-provider';
import { dialogs } from './dialogs';
import { AppMenu as am } from './menu';

import './port-service';
import './ipc-service';

const { MainWindow } = wp;

class LifecycleSingleton {
  private static instance: LifecycleSingleton;

  private constructor() {
    this.subscribeToWindowAllClosed();
    this.subscribeToOpenFile();
    this.subscribeToBeforeQuit();
    this.subscribeToActivate();
    this.subscribeToProjectChange();
  }

  public static getInstance() {
    if (!LifecycleSingleton.instance) {
      LifecycleSingleton.instance = new LifecycleSingleton();
    }

    return LifecycleSingleton.instance;
  }

  public start() {
    app
      .whenReady()
      .then(() => {
        am.buildMenu(null);
        MainWindow.create();
        return true;
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }

  private subscribeToWindowAllClosed() {
    app.on('window-all-closed', () => {}); // do nothing, continue to run
  }

  /**
   * OSX: Invoked when opening a recent document from File->Open recent submenu
   */
  private subscribeToOpenFile() {
    app.on('open-file', (_event: Event, filePath: string) => {
      // TODO: this will be untested until packaged
      pp.loadProject(filePath);
    });
  }

  private subscribeToBeforeQuit() {
    app.on('before-quit', async () => {
      if (MainWindow.edited === true) {
        const doSave = dialogs.unsavedCheck();
        if (doSave === true) await pp.save();
      }
    });
  }

  /**
   * OSX: Invoked when user clicks on app icon in system tray
   * Windows: TODO: unknown
   * Linux: TODO: unknown
   */
  private subscribeToActivate() {
    return app.on('activate', () => {
      if (os.platform() === 'darwin') {
        MainWindow.create();
      }
    });
  }

  private subscribeToProjectChange() {
    pp.on(ProjectProviderEvent.NewProject, (title) => {
      MainWindow.title = title;

      const stubs = pp.project.devices.map((d) => d.stub);
      MainWindow.sendConfiguredDevices(stubs);
    });
  }
}

export const Lifecycle = LifecycleSingleton.getInstance();
