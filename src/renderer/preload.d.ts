import { HostService, ProjectService, DriverService } from '../main/preload';

declare global {
  interface Window {
    hostService: HostService;
    projectService: ProjectService;
    driverService: DriverService;
  }
}

export {};
