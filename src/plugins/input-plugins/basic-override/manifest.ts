import { InputPluginManifest } from '@shared/plugin-core/input-plugin-manifest';

const Manifest: InputPluginManifest = {
  title: 'Basic Override',
  description: 'Basic controls to modify the messages sent by this input.',
  gui: 'basic-override/gui.tsx',
  plugin: 'basic-override/index.ts',
  ipc: 'basic-override/ipc.ts',
  requirements: [],
};

export default Manifest;
