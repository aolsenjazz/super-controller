import { InputPluginManifest } from '@shared/plugin-core/input-plugin-manifest';

const Manifest: InputPluginManifest = {
  title: 'Input Overrides',
  description: 'Basic controls to modify the messages sent by this input.',
  gui: 'basic-override/gui/gui.tsx',
  plugin: 'basic-override/index.ts',
  requirements: [],
};

export default Manifest;
