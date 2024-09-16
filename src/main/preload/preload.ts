/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * This file exists in an isolated context with limited access to APIs, so no real work
 * can be done here. More at: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */
import { contextBridge, ipcRenderer } from 'electron';

import { deviceConfigService } from './device-config-service';
import { hostService } from './preload-host-service';
import { layoutService } from './preload-layout-service';
import { menuService } from './preload-menu-service';
import { pluginService } from './preload-plugin-service';
import { ProjectConfigService } from './project-config-service';

// the frontend uses a lot of listeners. because of this, this number gets
// pretty high. If it complains, make sure that we're not leaking memory,
// then increase this number.
ipcRenderer.setMaxListeners(1000);

contextBridge.exposeInMainWorld('LayoutService', layoutService);
contextBridge.exposeInMainWorld('MenuService', menuService);
contextBridge.exposeInMainWorld('DeviceConfigService', deviceConfigService);
contextBridge.exposeInMainWorld('HostService', hostService);
contextBridge.exposeInMainWorld('PluginService', pluginService);
contextBridge.exposeInMainWorld('ProjectConfigService', ProjectConfigService);
