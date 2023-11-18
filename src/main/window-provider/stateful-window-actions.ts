import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import { TITLE } from '../ipc-channels';
import { WindowActions } from './window-actions';
import { WindowFocusListener } from './window-focus-listener';

/**
 * Provides a simplified set of operations on a given window. Saves data
 * when the window is closed so that it can be accurately recreated.
 */
export abstract class StatefulWindowActions extends WindowActions {
  private listeners: WindowFocusListener[] = [];

  /**
   * OSX: Show the little dark dot in the red traffic light
   * Window: nothing
   * Linux: nothing
   */
  private windowEdited = false;

  /**
   * Window title. How this is implemented is up to the front end.
   */
  private windowTitle;

  constructor(url: string, title: string) {
    super(url);
    this.windowTitle = title;
  }

  public create(options: BrowserWindowConstructorOptions | undefined) {
    super.create(options);

    const w = BrowserWindow.fromId(this.id!)!;

    w.documentEdited = this.windowEdited;
    this.send(TITLE, this.windowTitle);

    w.on('focus', () => this.notifyListeners());
    w.on('closed', () => this.notifyListeners());
  }

  public set edited(edited: boolean) {
    if (this.id === undefined) {
      throw new Error(
        'Tried to set window.documentEdited because window was created'
      );
    }

    this.windowEdited = edited;
    BrowserWindow.fromId(this.id)?.setDocumentEdited(edited);
  }

  public set title(title: string) {
    this.windowTitle = title;
    this.send(TITLE, title);
  }

  /**
   * Invokes the WindowFocusListener when this window gains focus, or is closed.
   * This function is not invoked when the window "loses" focus without being
   * closed.
   */
  public onFocusChange(listener: WindowFocusListener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a WindowFocusListener
   */
  public offFocusChange(listener: WindowFocusListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) =>
      listener(BrowserWindow.getFocusedWindow())
    );
  }
}
