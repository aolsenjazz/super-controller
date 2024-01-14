import type { HostService } from '@main/preload/preload-host-service';
import type { ConfigService } from '@main/preload/preload-config-service';
import type { LayoutService } from '@main/preload/preload-layout-service';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
    LayoutService: LayoutService;
  }
}

export {};
