import type { PluginService } from '@main/preload/plugin-service';
import type { HostService } from '@main/preload/host-service';
import type { LayoutService } from '@main/preload/layout-service';
import type { MenuService } from '@main/preload/menu-service';
import type { DeviceConfigService } from '@main/preload/device-config-service';
import type { ProjectConfigService } from '@main/preload/project-config-service';
import type { InputConfigService } from '@main/preload/input-config-service';

declare global {
  interface Window {
    HostService: typeof HostService;
    LayoutService: typeof LayoutService;
    MenuService: typeof MenuService;
    PluginService: typeof PluginService;
    DeviceConfigService: typeof DeviceConfigService;
    ProjectConfigService: typeof ProjectConfigService;
    InputConfigService: typeof InputConfigService;
  }
}

export {};
