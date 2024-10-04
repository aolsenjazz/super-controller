/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * This file exists in an isolated context with limited access to APIs, so no real work
 * can be done here. More at: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */
import { contextBridge, ipcRenderer } from 'electron';

import { DeviceConfigService } from './device-config-service';
import { InputConfigService } from './input-config-service';
import { HostService } from './host-service';
import { LayoutService } from './layout-service';
import { MenuService } from './menu-service';
import { PluginService } from './plugin-service';
import { ReduxService } from './redux-service';

// the frontend uses a lot of listeners. because of this, this number gets
// pretty high. If it complains, make sure that we're not leaking memory,
// then increase this number.
ipcRenderer.setMaxListeners(1000);

contextBridge.exposeInMainWorld('LayoutService', LayoutService);
contextBridge.exposeInMainWorld('MenuService', MenuService);
contextBridge.exposeInMainWorld('DeviceConfigService', DeviceConfigService);
contextBridge.exposeInMainWorld('HostService', HostService);
contextBridge.exposeInMainWorld('PluginService', PluginService);
contextBridge.exposeInMainWorld('ReduxService', ReduxService);
contextBridge.exposeInMainWorld('InputConfigService', InputConfigService);
