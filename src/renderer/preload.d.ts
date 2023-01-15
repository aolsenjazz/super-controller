import {
  HostService,
  PortService,
  DriverService,
  IPCRenderer,
} from '../main/preload';

declare global {
  interface Window {
    hostService: HostService;
    portService: PortService;
    driverService: DriverService;
    ipcRenderer: IPCRenderer;
  }
}

export {};
