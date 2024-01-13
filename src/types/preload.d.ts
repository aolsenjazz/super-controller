import type { HostService } from '../main/preload/preload-host-service';
import type { ConfigService } from '../main/preload/preload-config-service';
import type { TranslatorService } from '../main/preload/preload-translator-service';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
    TranslatorService: TranslatorService;
  }
}

export {};
