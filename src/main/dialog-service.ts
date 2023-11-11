import { dialog } from 'electron';

/**
 * If unsaved changes, prompt user to save first.
 *
 * @returns should we save?
 */
export function unsavedCheckSync() {
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
 * Prompt the user to save progress before it's erased. Returns whether or not
 * changes were saved.
 */
export async function unsavedCheck() {
  return unsavedCheckSync();
}
