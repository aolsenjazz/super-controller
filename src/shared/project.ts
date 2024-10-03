import { BaseIcicle } from './freezable';

interface ProjectDTO extends BaseIcicle {
  version: number;
}

export class Project {
  static CURRENT_VERSION = 6;

  version?: number;

  constructor(version?: number) {
    this.version = version || Project.CURRENT_VERSION;
  }

  toDTO(): ProjectDTO {
    return {
      version: this.version || Project.CURRENT_VERSION,
      className: this.constructor.name,
    };
  }
}
