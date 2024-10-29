/**
 * Base class for upgrade files
 */
export abstract class BaseUpgrade {
  abstract applyUpgrade(oldProjectString: string): string;

  abstract rollback(freshProjectString: string): string;

  abstract verify(): void;
}
