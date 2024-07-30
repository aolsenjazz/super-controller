import { dialog } from 'electron';
import path from 'path';

/**
 * Prompt the user to save progress before it's erased. Returns whether or not
 * changes were saved.
 */
function unsavedCheck() {
  const value = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Yes', 'No'],
    title: 'Unsaved Progress',
    message: 'You are about to lose progress. Do you want to save first?',
  });

  const yes = 0;
  return value === yes;
}

/**
 * Prompt the user to save the current project to the given location
 */
function save(recommendedDir: string, fileName: string) {
  return dialog.showSaveDialog({
    filters: [{ name: 'SuperController', extensions: ['controller'] }],
    defaultPath: path.join(recommendedDir, fileName),
  });
}

/**
 * Prompt the user to select a file to open
 */
function open(recommendedDir: string) {
  return dialog.showOpenDialog({
    defaultPath: recommendedDir,
    filters: [{ name: 'SuperController', extensions: ['controller'] }],
  });
}

export const dialogs = {
  unsavedCheck,
  open,
  save,
};
