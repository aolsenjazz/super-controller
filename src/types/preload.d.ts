import { HostService, ProjectService, DeviceService } from '../main/preload';

declare global {
  interface Window {
    hostService: HostService;
    projectService: ProjectService;
    deviceService: DeviceService;
  }
}

export {};
