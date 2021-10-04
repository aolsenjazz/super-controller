import { ipcMain, Event, dialog } from 'electron';

import { Project } from './project';
import { windowService } from './window-service';
import { DRIVERS } from './drivers';
import {
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
} from './hardware-config';

import { SaveOpenService } from './save-open-service';
import { PortService } from './ports/port-service';

/**
 * Manages communications to and from controllers, and acts as the ground-truth.
 * `this.project` should be regarded as the only true and correct version of the project
 * (compared to the `Project` object in frontend), and the frontend project object should
 * always be a copy of this project.
 */
export class Background {
  /* The ground-truth current project */
  project: Project;

  /* Manages communications to/from ports */
  portService: PortService;

  /* Saves + opens files */
  saveOpenService: SaveOpenService;

  constructor() {
    this.project = new Project();
    this.portService = new PortService(this.project);
    this.saveOpenService = new SaveOpenService();

    this.initIpc();
  }

  /* When the project is updated, update our 'master' version and send our version to frontend */
  initIpc() {
    ipcMain.on(
      'project',
      (_e: Event, projString: string, deviceId: string, inputIds: string[]) => {
        const proj = Project.fromJSON(projString);
        this.onProjectUpdate(proj, true, deviceId, inputIds);
      }
    );

    /* When a device is added to project, added it to the ground-truth project and send to frontend */
    ipcMain.on(
      'add-device',
      (_e: Event, id: string, name: string, occurNum: number) => {
        const driver = DRIVERS.get(name);

        const config = driver
          ? SupportedDeviceConfig.fromDriver(id, occurNum, driver!)
          : new AnonymousDeviceConfig(id, name, occurNum, new Map());
        this.project.addDevice(config);
        this.onProjectUpdate(this.project, true);
      }
    );

    /* When a device is removed from project, remove it and re-init all devices, send to frontend */
    ipcMain.on('remove-device', (_e: Event, deviceId: string) => {
      const device = this.project.getDevice(deviceId);
      this.project.removeDevice(device!);
      this.onProjectUpdate(this.project, true);
      this.portService.initAllDevices();
    });
  }

  /**
   * The project has been updated. Set the window to edited (little red dot in the X button),
   * send the new ground-truth project to frontend, update hardware lights.
   *
   * @param p The new version of the project
   * @param edited Is the document in an edited state?
   * @param dId The id of the updated device, if a device config was updated
   * @param iIds List of input ids that were updated, if any
   */
  onProjectUpdate(p: Project, edited: boolean, dId?: string, iIds?: string[]) {
    this.project = p;

    this.portService.project = this.project;
    windowService.sendProject(this.project);
    windowService.setEdited(edited);

    if (dId !== undefined && iIds !== undefined) {
      this.portService.updateLights(dId, iIds);
    }
  }

  /**
   * Prompt the user to save progress before it's erased. Returns whether or not
   * changes were saved.
   */
  async unsavedCheck() {
    const wereResultsSaved = this.unsavedCheckSync();
    return wereResultsSaved;
  }

  /**
   * If unsaved changes, prompt user to save first. Returns whether or
   * not changes were saved.
   */
  unsavedCheckSync() {
    if (windowService.edited) {
      const value = dialog.showMessageBoxSync({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Unsaved Progress',
        message: 'You are about to lose progress. Do you want to save first?',
      });

      const yes = 0;
      if (value === yes) {
        return this.saveOpenService.saveSync(this.project);
      }

      return false;
    }

    return true;
  }

  /* LIFECYCLE */

  /* Invoked when a new window has opened and finished loading index.html */
  onDidFinishLoad() {
    windowService.sendProject(this.project);
    windowService.setEdited(windowService.edited);

    this.portService.sendToFrontend();
    windowService.sendDrivers(DRIVERS);
  }

  /* Invoked when a `BrowserWindow` is closed */
  onClosed() {}

  /**
   * Invoked prior to application quitting. Returns whether or not app should continue
   * to quit.
   */
  beforeQuit() {
    this.unsavedCheckSync();
    return true;
  }

  /* MENU/KEYBINDS */

  /* File->New or cmd+N */
  onNew() {
    this.saveOpenService = new SaveOpenService();
    return this.unsavedCheck().then((didSave) => {
      if (didSave) this.onProjectUpdate(new Project(), false);
      return null;
    });
  }

  /* File->Open or cmd+O */
  onOpen() {
    return this.unsavedCheck()
      .then(() => this.saveOpenService.open())
      .then((proj) => this.onProjectUpdate(proj, false))
      .then(() => this.portService.initAllDevices())
      .catch(() => {}); // ignore cancel dialogs
  }

  /* File->SaveAs or shift+cmd+s */
  onSaveAs() {
    return this.saveOpenService
      .saveAs(this.project)
      .then((proj) => this.onProjectUpdate(proj, false));
  }

  /* File->Save or cmd+s */
  onSave() {
    return this.saveOpenService
      .save(this.project)
      .then((proj) => this.onProjectUpdate(proj, false));
  }

  /* Called on .controller double click, menu->Open Recent */
  onOpenFile(filePath: string) {
    this.unsavedCheckSync();
    const proj = Project.fromFile(filePath);
    this.onProjectUpdate(proj, false);
    this.portService.initAllDevices();
  }
}
