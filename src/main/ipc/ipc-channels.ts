/**
 * IPC channel names used to transmit data pertaining to the host OS or devices connected to the host
 */
export const HOST = {
  OS: 'os',
  TITLE: 'title',
  REQUEST: 'request',
  GET_CONNECTED_DEVICES: 'get-connected-devices',
};

export const INPUT_CONFIG = {
  REMOVE_PLUGIN: 'remove-input-plugin',
  UPDATE_INPUT: 'update-input',
  INPUT_PLUGIN_MENU: 'input-plugin-menu',
  GET_INPUT_CONFIGS: 'get-input-configs',
};

export const DEVICE_CONFIG = {
  ADD_DEVICE: 'add-device',
  DEVICE_PLUGIN_MENU: 'device-plugin-menu',
  REMOVE_DEVICE: 'remove-device',
  UPDATE_DEVICE: 'update-device',
  REMOVE_PLUGIN: 'remove-device-plugin',
  SET_CHILD: 'set-child',
  GET_CONFIGURED_DEVICES: 'get-configured-devices',
};

export const LAYOUT = {
  GET_LAYOUT: 'get-layout',
  SET_LAYOUT: 'set-layout',
  GET_LAYOUT_ITEM: 'get-layout-item',
  SET_LAYOUT_ITEM: 'set-layout-item',
};

export const PLUGIN = {
  UPDATE: 'plugin-update',
  POWER: 'toggle-power',
  COLLAPSED: 'toggle-collapsed',
  GET_ALL_PLUGINS: 'get-all-plugins',
};
