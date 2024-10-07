import { app, Event } from 'electron';
import os from 'os';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-extension-installer';

import { WindowProvider } from './window-provider';
import { ProjectProvider as pp } from './project-provider';
import { dialogs } from './dialogs';
import { AppMenu as am } from './menu';

import './port-service';
import './ipc-service';
import './initialize-plugin-ipc';
import './initialize-device-config-ipc';
import './initialize-input-config-ipc';

const { MainWindow } = WindowProvider;

async function installRDT() {
  const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  if (isDebug) {
    await installExtension(REDUX_DEVTOOLS);
    await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    });
  }
}

class LifecycleSingleton {
  private static instance: LifecycleSingleton;

  private constructor() {
    this.subscribeToWindowAllClosed();
    this.subscribeToOpenFile();
    this.subscribeToBeforeQuit();
    this.subscribeToActivate();
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
      .then(async () => {
        await installRDT();

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
   * Windows: Does nothing
   * Linux: Does nothing
   */
  private subscribeToActivate() {
    return app.on('activate', () => {
      if (os.platform() === 'darwin') {
        MainWindow.create();
      }
    });
  }
}

export const Lifecycle = LifecycleSingleton.getInstance();
