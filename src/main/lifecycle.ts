import { app, Event } from 'electron';
import os from 'os';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-extension-installer';

import { wp } from './window-provider';
import {
  ProjectProvider as pp,
  ProjectProviderEvent,
} from './project-provider';
import { dialogs } from './dialogs';
import { AppMenu as am } from './menu';

import './port-service';
import './ipc-service';
import {
  DevicesChangedEvent,
  ProjectChangedEvent,
} from './project-provider/project-event-emitter';

const { MainWindow } = wp;

async function installRDT() {
  const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  if (isDebug) {
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

  private subscribeToProjectChange() {
    const projChangeCb = ({ name, project }: ProjectChangedEvent) => {
      MainWindow.title = name;
      MainWindow.edited = false;

      const stubs = project.devices.map((d) => d.stub);
      MainWindow.sendConfiguredDevices(stubs);
    };

    pp.on(ProjectProviderEvent.NewProject, projChangeCb);
    pp.on(ProjectProviderEvent.Save, projChangeCb);

    const deviceChangeCb = ({ changed, project }: DevicesChangedEvent) => {
      MainWindow.edited = true;
      MainWindow.sendConfiguredDevices(project.devices.map((d) => d.stub));
      changed.forEach((d) => {
        MainWindow.sendConfigStub(d.id, d.stub);
      });
    };

    pp.on(ProjectProviderEvent.DevicesChanged, deviceChangeCb);
  }
}

export const Lifecycle = LifecycleSingleton.getInstance();
