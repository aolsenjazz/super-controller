import { ipcMain, Event, dialog } from 'electron';

import { Project } from './project';
import { windowService } from './window-service';
import { DRIVERS } from './drivers';
import { SupportedDeviceConfig } from './hardware-config';

import { SaveOpenService } from './save-open-service';
import { PortService } from './ports/port-service';

export class Background {
  project: Project;

  portService: PortService;

  saveOpenService: SaveOpenService;

  constructor() {
    this.project = new Project();
    this.portService = new PortService(this.project);
    this.saveOpenService = new SaveOpenService();

    this.initIpc();
  }

  initIpc() {
    ipcMain.on(
      'project',
      (_e: Event, projString: string, deviceId: string, inputIds: string[]) => {
        const proj = Project.fromJSON(projString);
        this.onProjectUpdate(proj, true, deviceId, inputIds);
      }
    );

    ipcMain.on(
      'add-device',
      (_e: Event, id: string, name: string, occurNum: number) => {
        const driver = DRIVERS.get(name);
        const config = SupportedDeviceConfig.fromDriver(id, occurNum, driver!);
        this.project.addDevice(config);
        this.onProjectUpdate(this.project, true);
      }
    );

    ipcMain.on('remove-device', (_e: Event, deviceId: string) => {
      const device = this.project.getDevice(deviceId);
      this.project.removeDevice(device!);
      this.onProjectUpdate(this.project, true);
      this.portService.initAllDevices();
    });
  }

  onProjectUpdate(p: Project, edited: boolean, dId?: string, iIds?: string[]) {
    this.project = p;

    this.portService.project = this.project;
    windowService.sendProject(this.project);
    windowService.setEdited(edited);

    if (dId !== undefined && iIds !== undefined)
      this.portService.updateLights(dId, iIds);
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
