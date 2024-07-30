import { BrowserWindow, MenuItemConstructorOptions } from 'electron';

const subMenuFile: MenuItemConstructorOptions = {
  label: '&File',
  submenu: [
    {
      label: '&Open',
      accelerator: 'Ctrl+O',
    },
    {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click: () => {
        // this.mainWindow.close();
      },
    },
  ],
};

const subMenuView: MenuItemConstructorOptions = {
  label: '&View',
  submenu:
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
      ? [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: () => {
              // this.mainWindow.webContents.reload();
            },
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () => {
              // this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            },
          },
          {
            label: 'Toggle &Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: () => {
              // this.mainWindow.webContents.toggleDevTools();
            },
          },
        ]
      : [
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () => {
              // this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            },
          },
        ],
};

/**
 * Builds app menu, omitted window-specific commands when a window is not present
 */
export function build(w: BrowserWindow | null) {
  return w === null ? [subMenuFile] : [subMenuFile, subMenuView];
}
