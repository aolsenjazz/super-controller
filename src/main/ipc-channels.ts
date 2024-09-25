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
  GET_CONNECTION_DETAILS: 'get-connection-details',
  MIDI_EVENT: 'midi-event',

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

  REQUEST_DEVICE_CONFIG_STUB: 'request-device-config-stub',
  GET_CONFIGURED_DEVICES: 'get-configured-devices',
  CONFIGURED_DEVICES: 'configured-devices',

  REQUEST_INPUT_CONFIG_STUB: 'request-input-config-stub',
};

export const INPUT_CONFIG = {
  REMOVE_PLUGIN: 'remove-input-plugin',
  UPDATE_INPUT: 'update-input',
  GET_INPUT_CONFIGS: 'get-input-configs',
  GET_INPUT_CONFIG: 'get-input-config',
  INPUTS_CHANGE: 'inputs-change',
};

export const DEVICE_CONFIG = {
  REMOVE_PLUGIN: 'remove-device-plugin',
  SET_CHILD: 'set-child',
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
