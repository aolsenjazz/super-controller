import {
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
} from './hardware-config';

const fs = require('fs');

/**
 * Master project class. The ground-truth `Project` object is located in the
 * backend, and is frequently sent to the frontend to show config/environment changes.
 */
export class Project {
  /* Name of the project */
  name: string;

  /* Configured devices. See `SupportedDeviceConfig` for more. */
  devices: (SupportedDeviceConfig | AnonymousDeviceConfig)[];

  constructor(name = 'Untitled Project') {
    this.name = name;
    this.devices = [];
  }

  /**
   * Loads the file at given path. *DO NOT* invoke from frontend
   *
   * @param filePath The path to the file
   * @returns the project
   */
  static fromFile(filePath: string) {
    const jsonString = fs.readFileSync(filePath);
    return Project.fromJSON(jsonString);
  }

  /**
   * Loads a project from JSON string, used either in IPC or when loading
   * saved file. Should be used in combination with `project.toJSON()`
   *
   * @param { string } json Serialized representation of the project
   * @return { Project } The deserialized project
   */
  static fromJSON(json: string) {
    const obj = JSON.parse(json);
    const newProj = new Project();

    Object.assign(newProj, obj);
    newProj.devices = obj.devices.map((j: string) => {
      const o = JSON.parse(j);
      return o.supported
        ? SupportedDeviceConfig.fromParsedJSON(o)
        : AnonymousDeviceConfig.fromParsedJSON(o);
    });

    return newProj;
  }

  /**
   * Adds a device configuration to this project.
   *
   * @param config The config to add
   */
  addDevice(config: SupportedDeviceConfig | AnonymousDeviceConfig) {
    this.devices.push(config);
  }

  /**
   * Removes a device configuration to this project.
   *
   * @param config The config to remove
   */
  removeDevice(config: SupportedDeviceConfig | AnonymousDeviceConfig) {
    let idx = -1;
    this.devices.forEach((d, index) => {
      if (d.id === config.id) {
        idx = index;
      }
    });

    if (idx !== -1) {
      this.devices.splice(idx, 1);
    }
  }

  /**
   * Returns the device config for given id.
   *
   * @param id The requested device id
   * @returns device config
   */
  getDevice(id: string | undefined | null) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === id) return this.devices[i];
    }
    return null;
  }

  /**
   * Serialize the project and all child configs
   *
   * @param includeState Should `InputConfig` state be added?
   * @returns Serialized JSON string
   */
  toJSON(includeState: boolean) {
    const project = {
      name: this.name,
      devices: this.devices.map((dev) => dev.toJSON(includeState)),
    };

    return JSON.stringify(project);
  }
}
