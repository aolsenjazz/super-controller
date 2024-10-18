/**
 * Contains meta and descriptive information for all device and input plugins.
 * Useful for plugin subcomponent discovery, and enumerating all available
 * plugins.
 */
export interface BasePluginManifest {
  title: string;
  description: string;
  gui: string;

  /**
   * Relative path to the Plugin file
   */
  plugin: string;

  /**
   * For plugins that need more sophisticated functionality, optionally provide
   * a relative path to a file which handles ipc calls from the frontend.
   */
  ipc?: string;
}
