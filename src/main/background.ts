import { dialog, app } from 'electron';
import path from 'path';

import { Project } from '@shared/project';

import { ProjectManager as pm } from './project-manager';
import { WindowService as ws } from './window-service';
import { SaveOpenService as sos } from './save-open-service';
import { PortService as ps } from './port-service';
import { projectFromFile } from './util-main';

/**
 * If unsaved changes, prompt user to save first. Returns whether or
 * not changes were saved.
 */
function unsavedCheckSync() {
  if (ws.edited) {
    const value = dialog.showMessageBoxSync({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Unsaved Progress',
      message: 'You are about to lose progress. Do you want to save first?',
    });

    const yes = 0;
    if (value === yes) sos.saveSync(pm.getProject());
  }
}

/**
 * Prompt the user to save progress before it's erased. Returns whether or not
 * changes were saved.
 */
async function unsavedCheck() {
  unsavedCheckSync();
}

/* LIFECYCLE */

/* Invoked when a new window has opened and finished loading index.html */
export function onDidFinishLoad() {
  ws.sendProject(pm.getProject());
  ws.setEdited(ws.edited);
}

/* Invoked when a `BrowserWindow` is closed */
export function onClosed() {}

/**
 * Invoked prior to application quitting. Returns whether or not app should continue
 * to quit.
 */
export function beforeQuit() {
  unsavedCheckSync();
  return true;
}

/* MENU/KEYBINDS */

/* File->New or cmd+N */
export function onNew() {
  sos.currentPath = undefined;

  return unsavedCheck().then(() => {
    // this.project = new Project(); TODO: this needs to be changed
    // ps.project = this.project; TODO: this needs to go
    ws.sendProject(new Project()); // TODO: this isn't correct anymore
    ws.setEdited(false);
    return ws.sendTitle('Untitled Project');
  });
}

/* File->SaveAs or shift+cmd+s */
export function onSaveAs() {
  return sos
    .saveAs(pm.getProject())
    .then((fPath: string) => path.basename(fPath))
    .then((fName: string) => ws.sendTitle(fName))
    .then(() => ws.setEdited(false));
}

/* File->Save or cmd+s */
export function onSave() {
  return sos
    .save(pm.getProject())
    .then((fPath: string) => path.basename(fPath))
    .then((fName: string) => ws.sendTitle(fName))
    .then(() => ws.setEdited(false));
}

/**
 * Open the file at the given location
 *
 * @param filePath /the/path/to/the/file.controller
 * @param doUnsavedCheck Notify the user thhat they're about to lose unsaved work?
 */
export function onOpenFile(filePath: string, doUnsavedCheck: boolean) {
  if (doUnsavedCheck) unsavedCheckSync();

  app.addRecentDocument(filePath);

  const proj = projectFromFile(filePath);

  ws.sendTitle(path.basename(filePath));
  ws.setEdited(false);
  ws.sendProject(proj);

  // this.project = proj; this needs to chnage
  sos.currentPath = filePath;

  // this *must* be the last call on the stack. this triggers the `VirtualPortService`
  // to open new virtual ports, which can cause a race condition (conflicting with the
  // `proj` object) when accessing the native functions required to open a vPort
  ps.project = proj;
}

/* File->Open or cmd+O */
export function onOpen() {
  return unsavedCheck()
    .then(() => sos.open())
    .then((fPath: string) => onOpenFile(fPath, false))
    .catch(() => {}); // ignore cancel dialogs
}
