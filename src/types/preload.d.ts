import { HostService, ProjectService } from '../main/preload';

declare global {
  interface Window {
    hostService: HostService;
    projectService: ProjectService;
  }
}

export {};
