import { BrowserWindow } from 'electron';

import { MainWindowActions } from './main-window-actions';
import { WindowFocusListener } from './window-focus-listener';

/**
 * Convenience class for accessing windows and window events.
 */
class WindowProvider {
  public MainWindow: MainWindowActions;

  private listeners: WindowFocusListener[] = [];

  private static instance: WindowProvider;

  private constructor() {
    this.MainWindow = new MainWindowActions();

    this.MainWindow.onFocusChange(() => this.notifyListeners());
  }

  public static getInstance(): WindowProvider {
    if (!WindowProvider.instance) {
      WindowProvider.instance = new WindowProvider();
    }
    return WindowProvider.instance;
  }

  /**
   * Listen for BrowserWindow focus change events. Callback in invoked whenever
   * a window gains focus or is closed; this is not invoked when a window loses
   * focus so as to prevent double-firing upon selecting a different window.
   */
  public onFocusChange(listener: WindowFocusListener) {
    this.listeners.push(listener);
  }

  /**
   * Removed a WindowFocusListener
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

export const wp = WindowProvider.getInstance();
