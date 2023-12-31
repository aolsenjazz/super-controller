import { HostService, TranslatorService, ConfigService } from '../main/preload';

declare global {
  interface Window {
    HostService: HostService;
    ConfigService: ConfigService;
    TranslatorService: TranslatorService;
  }
}

export {};
