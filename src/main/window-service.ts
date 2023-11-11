import { BrowserWindow, Menu } from 'electron';
import os from 'os';

import { getAssetPath, getPreloadPath, resolveHtmlPath } from './util-main';

type WindowFocusListener = (w: BrowserWindow | null) => void;

/**
 * Convenience class for accessing the main window. Used for:
 *
 * 1. Sending information to the client
 * 2. Setting the document-edited state
 */
class WindowServiceSingleton {
  /* Has the document been edited (should there be a dot in the close button)? */
  edited = false;

  private listeners: WindowFocusListener[] = [];

  private static instance: WindowServiceSingleton;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): WindowServiceSingleton {
    if (!WindowServiceSingleton.instance) {
      WindowServiceSingleton.instance = new WindowServiceSingleton();
    }
    return WindowServiceSingleton.instance;
  }

  public async createMainWindow() {
    // create window
    const w = new BrowserWindow({
      show: false,
      width: 1024,
      height: 600,
      transparent: true,
      frame: false,
      minHeight: 312,
      minWidth: 850,
      titleBarStyle: os.platform() === 'darwin' ? 'hiddenInset' : 'default',
      icon: getAssetPath('icon.png'),
      webPreferences: { preload: getPreloadPath() },
    });

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.initInspectListener(w);
    }

    w.documentEdited = this.edited;
    w.loadURL(resolveHtmlPath('index.html'));
    w.on('ready-to-show', () => w.show());
    w.on('focus', () => this.notifyListeners());
    w.on('closed', () => this.notifyListeners());
  }

  /**
   * Sets the `window.documentEdited` to `edited`
   *
   * @param edited Is the document edited?
   */
  public setEdited(edited: boolean) {
    const windows = BrowserWindow.getAllWindows();
    const window = windows.length ? windows[0] : null;
    this.edited = edited;

    if (window !== null) {
      window.documentEdited = edited;
    }
  }

  private initInspectListener(w: BrowserWindow) {
    w.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            w.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: w });
    });
  }

  public subscribeToFocusChange(listener: WindowFocusListener) {
    this.listeners.push(listener);
  }

  public unsubscribeFromFocusChange(listener: WindowFocusListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) =>
      listener(BrowserWindow.getFocusedWindow())
    );
  }
}

export const WindowService = WindowServiceSingleton.getInstance();
