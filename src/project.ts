import { SupportedDeviceConfig } from './hardware-config';

const fs = require('fs');

export class Project {
  name: string;

  devices: SupportedDeviceConfig[];

  constructor(name = 'Untitled Project') {
    this.name = name;
    this.devices = [];
  }

  /**
   * Loads the file at given path using `fromJSON`
   */
  static fromFile(filePath: string) {
    const jsonString = fs.readFileSync(filePath);
    return Project.fromJSON(jsonString);
  }

  /**
   * Loads a project from JSON string, used either in IPC or when loading
   * saved file. Should be used in combination with `project.toJSON()`
   */
  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    const newProj = new Project();

    Object.assign(newProj, obj);
    newProj.devices = obj.devices.map((j: string) =>
      SupportedDeviceConfig.fromJSON(j)
    );

    return newProj;
  }

  addDevice(device: SupportedDeviceConfig) {
    this.devices.push(device);
  }

  removeDevice(device: SupportedDeviceConfig) {
    let idx = -1;
    this.devices.forEach((d, index) => {
      if (d.id === device.id) {
        idx = index;
      }
    });

    if (idx !== -1) {
      this.devices.splice(idx, 1);
    }
  }

  getDevice(id: string | undefined | null) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === id) return this.devices[i];
    }
    return null;
  }

  toJSON(includeState: boolean) {
    const project = {
      name: this.name,
      devices: this.devices.map((dev) => dev.toJSON(includeState)),
    };

    return JSON.stringify(project);
  }
}
