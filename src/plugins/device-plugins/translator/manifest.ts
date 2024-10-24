import { BasePluginManifest } from '../../core/base-plugin-manifest';

const Manifest: BasePluginManifest = {
  title: 'Translator',
  description:
    'Translates messages received from the devices into other messages.',
  gui: 'translator/gui/TranslatorPlugin.tsx',
  plugin: 'translator/index.ts',
};

export default Manifest;
