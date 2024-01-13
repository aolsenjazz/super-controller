import type { HostService } from '../main/preload/preload-host-service';
import type { ConfigService } from '../main/preload/preload-config-service';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
  }
}

export {};
