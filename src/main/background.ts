import { ipcMain, Event, dialog, app, shell } from 'electron';
import path from 'path';
import os from 'os';

import {
  InputConfig,
  SupportedDeviceConfig,
  DeviceConfig,
} from '@shared/hardware-config';
import { parse } from '@shared/util';
import { Project } from '@shared/project';
import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { DRIVERS } from '@shared/drivers';

import { windowService } from './window-service';
import { projectFromFile } from './util-main';
import { SaveOpenService } from './save-open-service';
import { PortService } from './port-service';

import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
  PORTS,
  OS,
  DRIVERS as DRIVERS_CHANNEL,
  REQUEST,
} from './ipc-channels';

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
    // When the frontend requests an updated port list, send it
    ipcMain.on(PORTS, () => {
      this.portService.sendToFrontend();
    });

    // When the frontend requests the drivers, send them
    ipcMain.on(DRIVERS_CHANNEL, (e: Event) => {
      e.returnValue = Array.from(DRIVERS.entries());
    });

    // When the frontend as for OS details, send them
    ipcMain.on(OS, (e: Event) => {
      e.returnValue = os.platform();
    });

    // When a device is added to project in the frontend, add to our `Project`
    ipcMain.on(ADD_DEVICE, (_e: Event, c: string) => {
      windowService.setEdited(true);

      const config = parse<DeviceConfig>(c);
      this.project.addDevice(config);

      // init light defaults, run device control sequence
      this.portService.updatePorts();
    });

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(REMOVE_DEVICE, (_e: Event, deviceId: string) => {
      windowService.setEdited(true);

      const config = this.project.getDevice(deviceId);

      if (!config) throw new Error(`no config exists for device ${deviceId}`);

      this.project.removeDevice(config);
      this.portService.updatePorts();
    });

    ipcMain.on(UPDATE_DEVICE, (_e: Event, deviceJSON: string) => {
      windowService.setEdited(true);

      const config = parse<DeviceConfig>(deviceJSON);

      this.project.removeDevice(config);
      this.project.addDevice(config);
    });

    ipcMain.on(
      UPDATE_INPUT,
      (_e: Event, configId: string, inputString: string) => {
        const config = this.project.getDevice(
          configId
        ) as SupportedDeviceConfig;
        const inputConfig = parse<InputConfig>(inputString);

        const inputConfigIdx = config.inputs
          .map((conf, i) => [conf, i] as [InputConfig, number])
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([conf, _i]) => conf.id === inputConfig.id)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(([_conf, i]) => i)[0];

        config.inputs.splice(inputConfigIdx, 1, inputConfig);
        this.portService.syncInputLight(configId, inputConfig);
        windowService.setEdited(true);
      }
    );

    ipcMain.on(REQUEST, (_e: Event, deviceName: string) => {
      const template = deviceName
        ? controllerRequest(deviceName)
        : fivePinRequest();
      shell.openExternal(
        `mailto:${template.to}?subject=${template.subject}&body=${template.body}`
      );
    });
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

    windowService.sendTitle(path.basename(filePath));
    windowService.setEdited(false);
    windowService.sendProject(proj);

    this.project = proj;
    this.saveOpenService.currentPath = filePath;

    // this *must* be the last call on the stack. this triggers the `VirtualPortService`
    // to open new virtual ports, which can cause a race condition (conflicting with the
    // `proj` object) when accessing the native functions required to open a vPort
    this.portService.project = proj;
  }
}
