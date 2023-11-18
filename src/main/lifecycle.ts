import { app } from 'electron';
import os from 'os';

import { wp } from './window-provider';
import { ProjectProvider as pp } from './project-provider';
import { dialogs } from './dialogs';
import { AppMenu as am } from './menu';
import './port-service';

const { MainWindow } = wp;

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
      .then(() => {
        am.buildMenu(null);
        MainWindow.create();
        return true;
      })
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
      // pp.currentPath = filePath; TODO: this shouldn't be necessary
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
}

export const Lifecycle = LifecycleSingleton.getInstance();

// export const Background = {
//   /* Invoked when a new window has opened and finished loading index.html */
//   onDidFinishLoad() {
//     ws.sendProject(pm.project);
//     ws.setEdited(ws.edited);
//   },

//   /* MENU/KEYBINDS */

//   /* File->New or cmd+N */
//   onNew() {
//     sos.currentPath = undefined;

//     // return unsavedCheck().then(() => {
//     //   // this.project = new Project(); TODO: this needs to be changed
//     //   // ps.project = this.project; TODO: this needs to go
//     //   ws.sendProject(new Project()); // TODO: this isn't correct anymore
//     //   ws.setEdited(false);
//     //   return ws.sendTitle('Untitled Project');
//     // });
//   },

//   /* File->SaveAs or shift+cmd+s */
//   onSaveAs() {
//     return sos
//       .saveAs(pm.project)
//       .then(() => path.basename(sos.currentPath!))
//       .then((fName: string) => ws.sendTitle(fName))
//       .then(() => ws.setEdited(false));
//   },

//   /* File->Save or cmd+s */
//   onSave() {
//     return sos
//       .save(pm.project)
//       .then(() => path.basename(sos.currentPath!))
//       .then((fName: string) => ws.sendTitle(fName))
//       .then(() => ws.setEdited(false));
//   },

//   /* File->Open or cmd+O */
//   onOpen() {
//     sos
//       .open()
//       .then((fPath: string) => this.onOpenFile(fPath))
//       .catch(() => {}); // ignore cancel dialogs
//   },
// };
