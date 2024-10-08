import type { PluginService } from '@main/preload/plugin-service';
import type { HostService } from '@main/preload/host-service';
import type { LayoutService } from '@main/preload/layout-service';
import type { DeviceConfigService } from '@main/preload/device-config-service';

import type { InputConfigService } from '@main/preload/input-config-service';
import type { ReduxService } from '@main/preload/redux-service';

declare global {
  interface Window {
    HostService: typeof HostService;
    LayoutService: typeof LayoutService;
    PluginService: typeof PluginService;
    DeviceConfigService: typeof DeviceConfigService;
    InputConfigService: typeof InputConfigService;
    ReduxService: typeof ReduxService;
  }
}

export {};
