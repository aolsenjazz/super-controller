import type { PluginService } from '@main/preload/preload-plugin-service';
import type { HostService } from '@main/preload/preload-host-service';
import type { LayoutService } from '@main/preload/preload-layout-service';
import type { MenuService } from '@main/preload/preload-menu-service';
import type { DeviceConfigService } from '@main/preload/device-config-service';
import type { ProjectConfigService } from '@main/preload/project-config-service';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
    LayoutService: LayoutService;
    MenuService: MenuService;
    PluginService: PluginService;
    DeviceConfigService: DeviceConfigService;
    ProjectConfigService: ProjectConfigService;
  }
}

export {};
