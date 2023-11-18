import { dialog } from 'electron';

class DialogServiceSingleton {
  private static instance: DialogServiceSingleton;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!DialogServiceSingleton.instance) {
      DialogServiceSingleton.instance = new DialogServiceSingleton();
    }

    return DialogServiceSingleton.instance;
  }

  /**
   * If unsaved changes, prompt user to save first.
   *
   * @returns should we save?
   */
  public unsavedCheckSync() {
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
  async unsavedCheck() {
    return this.unsavedCheckSync();
  }
}

export const DialogService = DialogServiceSingleton.getInstance();
