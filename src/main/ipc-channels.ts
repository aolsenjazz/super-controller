/**
 * IPC channel names used to transmit data pertaining to the host OS or devices connected to the host
 */
export const HOST = {
  OS: 'os',
  TITLE: 'title',
  REQUEST: 'request',

  REQUEST_DEVICE_STUB: 'request-device-stub',
  REQUEST_CONNECTED_DEVICES: 'request-connected-devices',
  CONNECTED_DEVICES: 'connected-devices',

  REQUEST_INPUT_STATE: 'request-input-state',
};

/**
 * IPC channel names used to transmit data pertaining to configurations
 */
export const CONFIG = {
  ADD_DEVICE: 'add-device',
  REMOVE_DEVICE: 'remove-device',
  UPDATE_DEVICE: 'update-device',
  GET_DEVICE_CONFIG: 'get-device-config',
  UPDATE_INPUT: 'update-input',
  GET_INPUT_CONFIG: 'get-input-config',

  REQUEST_DEVICE_CONFIG_STUB: 'request-device-config-stub',
  GET_CONFIGURED_DEVICES: 'get-configured-devices',
  CONFIGURED_DEVICES: 'configured-devices',

  INPUT_CONFIG_CHANGE: 'input-config-change',
  REQUEST_INPUT_CONFIG_STUB: 'request-input-config-stub',
  GET_INPUT_CONFIGS: 'get-input-configs',
};

/**
 * IPC channel names used to transmit data pertaining to translators
 */
export const TRANSLATOR = {
  REMOVE_TRANSLATOR_OVERRIDE: 'remove-translator-override',
  ADD_TRANSLATOR_OVERRIDE: 'add-translator-override',
  GET_TRANSLATOR_OVERRIDE: 'get-translator-override',
  REQUEST_OVERRIDES: 'request-overrides',
};

export const LAYOUT = {
  GET_LAYOUT: 'get-layout',
  SET_LAYOUT: 'set-layout',
  GET_LAYOUT_ITEM: 'get-layout-item',
  SET_LAYOUT_ITEM: 'set-layout-item',
};

export const MENU = {
  DEVICE_PLUGIN_MENU: 'device-plugin-menu',
  INPUT_PLUGIN_MENU: 'input-plugin-menu',
};
