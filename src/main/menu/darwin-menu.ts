import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';

import { BUG_REPORT, FEATURE_REQUEST } from '@shared/email-templates';

import { ProjectProvider as pp } from '../project-provider';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const subMenuAbout: DarwinMenuItemConstructorOptions = {
  label: 'SuperController',
  submenu: [
    {
      label: 'About SuperController',
      selector: 'orderFrontStandardAboutPanel:',
    },
    { type: 'separator' },
    { label: 'Services', submenu: [] },
    { type: 'separator' },
    {
      label: 'Hide SuperController',
      accelerator: 'Command+H',
      selector: 'hide:',
    },
    {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:',
    },
    { label: 'Show All', selector: 'unhideAllApplications:' },
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit();
      },
    },
  ],
};
const subMenuFile: DarwinMenuItemConstructorOptions = {
  label: 'File',
  submenu: [
    {
      label: 'New',
      accelerator: 'Command+N',
      click: () => {
        pp.initDefault();
      },
    },
    {
      label: 'Save',
      accelerator: 'Command+S',
      click: () => {
        pp.save();
      },
    },
    {
      label: 'Save As',
      accelerator: 'Shift+Command+S',
      click: () => {
        pp.saveAs();
      },
    },
    {
      label: 'Open',
      accelerator: 'Command+O',
      click: () => {
        pp.open();
      },
    },
    {
      label: 'Open Recent',
      role: 'recentDocuments',
      submenu: [
        {
          label: 'Clear Recent',
          role: 'clearRecentDocuments',
        },
      ],
    },
  ],
};
const subMenuEdit: DarwinMenuItemConstructorOptions = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
    {
      label: 'Select All',
      accelerator: 'Command+A',
      selector: 'selectAll:',
    },
  ],
};
const subMenuViewDev = (w: BrowserWindow) => {
  return {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => {
          w.webContents.reload();
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          w.setFullScreen(!w.isFullScreen());
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: () => {
          w.webContents.toggleDevTools();
        },
      },
    ],
  };
};
const subMenuViewProd = (w: BrowserWindow) => {
  return {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: () => {
          w.setFullScreen(!w.isFullScreen());
        },
      },
    ],
  };
};
const subMenuWindow: DarwinMenuItemConstructorOptions = {
  label: 'Window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:',
    },
    { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
    { type: 'separator' },
    { label: 'Bring All to Front', selector: 'arrangeInFront:' },
  ],
};

const subMenuContact: DarwinMenuItemConstructorOptions = {
  label: 'Contact',
  submenu: [
    {
      label: 'Report a Bug',
      click() {
        shell.openExternal(
          `mailto:${BUG_REPORT.to}?subject=${BUG_REPORT.subject}&body=${BUG_REPORT.body}`
        );
      },
    },
    {
      label: 'Feature Request',
      click() {
        shell.openExternal(
          `mailto:${FEATURE_REQUEST.to}?subject=${FEATURE_REQUEST.subject}&body=${FEATURE_REQUEST.body}`
        );
      },
    },
  ],
};

const subMenuView =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
    ? subMenuViewDev
    : subMenuViewProd;

export function build(w: BrowserWindow | null) {
  let menu = [subMenuAbout, subMenuFile, subMenuEdit];

  if (w !== null) {
    menu = menu.concat([subMenuView(w), subMenuWindow]);
  }

  return menu.concat(subMenuContact);
}
