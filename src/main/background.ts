import { ipcMain, Event, dialog, app } from 'electron';

import { windowService } from './window-service';
import { DRIVERS } from './drivers';
import { projectFromFile } from './util-main';
import { SaveOpenService } from './save-open-service';
import { PortService } from './ports/port-service';

import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} from '@shared/ipc-channels';
import {
  SupportedDeviceConfig,
  InputConfig,
  AnonymousDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';

const path = require('path');

/**
 * Manages communications to/from controllers, and informs the front end.
 * `this.project` shoul be an identical copy to the front end's `Project` object.
 */
export class Background {
  /* The current project */
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

  initIpc() {
    /* When a device is added to project in the frontend, add to our `Project` */
    ipcMain.on(ADD_DEVICE, (_e: Event, deviceJSON: string) => {
      windowService.setEdited(true);

      // deserialize device
      const deviceObj = JSON.parse(deviceJSON);
      const config = deviceObj.supported
        ? SupportedDeviceConfig.fromParsedJSON(deviceObj)
        : AnonymousDeviceConfig.fromParsedJSON(deviceObj);

      this.project.addDevice(config);

      // init light defaults, run device control sequence
      this.portService.initDevice(config.id);
    });

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(REMOVE_DEVICE, (_e: Event, deviceId: string) => {
      windowService.setEdited(true);

      const config = this.project.getDevice(deviceId);

      if (!config) throw new Error(`no config exists for device ${deviceId}`);

      this.project.removeDevice(config);

      this.portService.relinquishDevice(deviceId);
    });

    ipcMain.on(UPDATE_DEVICE, (_e: Event, deviceJSON: string) => {
      windowService.setEdited(true);

      // deserialize device
      const deviceObj = JSON.parse(deviceJSON);
      const config = deviceObj.supported
        ? SupportedDeviceConfig.fromParsedJSON(deviceObj)
        : AnonymousDeviceConfig.fromParsedJSON(deviceObj);

      this.project.removeDevice(config);
      this.project.addDevice(config);
    });

    ipcMain.on(
      UPDATE_INPUT,
      (_e: Event, configId: string, inputJSON: string) => {
        const config = this.project.getDevice(
          configId
        ) as SupportedDeviceConfig;
        const inputConfig = InputConfig.fromJSON(inputJSON);

        const inputConfigIdx = config.inputs
          .map((conf, i) => [conf, i] as [InputConfig, number])
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([conf, _i]) => conf.id === inputConfig.id)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(([_conf, i]) => i)[0];

        config.inputs.splice(inputConfigIdx, 1, inputConfig);
        this.portService.syncDeviceLights(configId);
      }
    );
  }

  /**
   * Prompt the user to save progress before it's erased. Returns whether or not
   * changes were saved.
   */
  async unsavedCheck() {
    this.unsavedCheckSync();
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
      if (value === yes) this.saveOpenService.saveSync(this.project);
    }
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
    this.saveOpenService.currentPath = undefined;

    return this.unsavedCheck().then(() => {
      this.project = new Project();
      this.portService.project = this.project;
      windowService.sendProject(new Project());
      windowService.setEdited(false);
      return windowService.sendTitle('Untitled Project');
    });
  }

  /* File->Open or cmd+O */
  onOpen() {
    return this.unsavedCheck()
      .then(() => this.saveOpenService.open())
      .then((fPath) => this.onOpenFile(fPath, false))
      .catch(() => {}); // ignore cancel dialogs
  }

  /* File->SaveAs or shift+cmd+s */
  onSaveAs() {
    return this.saveOpenService
      .saveAs(this.project)
      .then((fPath) => path.basename(fPath))
      .then((fName) => windowService.sendTitle(fName))
      .then(() => windowService.setEdited(false));
  }

  /* File->Save or cmd+s */
  onSave() {
    return this.saveOpenService
      .save(this.project)
      .then((fPath) => path.basename(fPath))
      .then((fName) => windowService.sendTitle(fName))
      .then(() => windowService.setEdited(false));
  }

  /**
   * Open the file at the given location
   *
   * @param filePath /the/path/to/the/file.controller
   * @param doUnsavedCheck Notify the user thhat they're about to lose unsaved work?
   */
  onOpenFile(filePath: string, doUnsavedCheck: boolean) {
    if (doUnsavedCheck) this.unsavedCheckSync();

    app.addRecentDocument(filePath);

    const proj = projectFromFile(filePath);

    this.project = proj;
    this.portService.project = proj;

    windowService.sendTitle(path.basename(filePath));
    windowService.setEdited(false);
    windowService.sendProject(proj);

    this.saveOpenService.currentPath = filePath;
  }
}
