/**
 * Contains meta and descriptive information for all device and input plugins.
 * Useful for plugin subcomponent discovery, and enumerating all available
 * plugins.
 */
export type PluginManifest = {
  title: string;
  description: string;
  gui: string;
  plugin: string;
  ipc?: string;
};
