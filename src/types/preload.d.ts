import type { PluginService } from '@main/preload/preload-plugin-service';
import type { HostService } from '@main/preload/preload-host-service';
import type { ConfigService } from '@main/preload/preload-config-service';
import type { LayoutService } from '@main/preload/preload-layout-service';
import type { MenuService } from '@main/preload/preload-menu-service';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
    LayoutService: LayoutService;
    MenuService: MenuService;
    PluginService: PluginService;
  }
}

export {};
