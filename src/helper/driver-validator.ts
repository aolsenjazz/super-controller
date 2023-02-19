/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Color,
  InputDriver,
  KeyboardDriver,
  InputGridDriver,
  DeviceDriver,
  FxDriver,
} from '@shared/driver-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateColor(color: any): asserts color is Color {
  if (!color.name || typeof color.name !== 'string') {
    throw new Error(
      'Color object is missing a name property or it is not a string'
    );
  }
  if (!color.string || typeof color.string !== 'string') {
    throw new Error(
      'Color object is missing a string property or it is not a string'
    );
  }

  if (color.modifier && !['blink', 'pulse'].includes(color.modifier)) {
    throw new Error('Color modifier exists and is note in [blink, pulse]');
  }
  if (color.default !== undefined && typeof color.default !== 'boolean') {
    throw new Error('Color object default property is not a boolean');
  }
  if (!color.array || !Array.isArray(color.array)) {
    throw new Error('Color object is missing array');
  }
  if (color.array.length < 3) {
    throw new Error('Color array must have at least 3 items');
  }
  const arr = color.array;
  if (arr[0] < 128 || arr[0] > 255) {
    throw new Error(`invalid array value ${arr[0]}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arr.forEach((ev: any) => {
    if (ev === null) {
      throw new Error(`array member must not be null`);
    }
  });
}

function validateKeyboardDriver(obj: any): asserts obj is KeyboardDriver {
  if (typeof obj !== 'object') {
    throw new Error('Expected an object');
  }

  if (
    typeof obj.defaultOctave !== 'number' ||
    obj.defaultOctave < -2 ||
    obj.defaultOctave > 8
  ) {
    throw new Error('Expected defaultOctave to be a number between -2 and 8');
  }

  if (
    typeof obj.nOctaves !== 'number' ||
    obj.nOctaves < 0 ||
    obj.nOctaves > 100 ||
    !Number.isInteger(obj.nOctaves)
  ) {
    throw new Error(
      'Expected nOctaves to be a positive integer between 0 and 100'
    );
  }

  if (typeof obj.channel !== 'number' || obj.channel < 0 || obj.channel > 15) {
    throw new Error('Expected channel to be a number between 0 and 15');
  }

  if (typeof obj.width !== 'number' || obj.width < 0) {
    throw new Error('Expected width to be a positive number');
  }

  if (typeof obj.height !== 'number' || obj.height < 0) {
    throw new Error('Expected height to be a positive number');
  }

  if (typeof obj.left !== 'number' || obj.left < 0) {
    throw new Error('Expected left to be a positive number');
  }

  if (typeof obj.bottom !== 'number' || obj.bottom < 0) {
    throw new Error('Expected bottom to be a positive number');
  }

  if (typeof obj.enabled !== 'boolean') {
    throw new Error('Expected enabled to be a boolean');
  }
}

export function validateInputDriver(
  input: any,
  ig: InputGridDriver
): asserts input is InputDriver {
  if (typeof input !== 'object') {
    throw new Error('Input is not an object');
  }
  if (!input.hasOwnProperty('number') || typeof input.number !== 'number') {
    throw new Error(
      "'default:number' field is missing required field 'number' or it is not a number"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('channel') &&
    (!input.hasOwnProperty('channel') ||
      typeof input.channel !== 'number' ||
      !(input.channel >= 0 && input.channel <= 15))
  ) {
    throw new Error(
      "'default:channel' field is missing required field 'channel' or it is not a valid channel (0-15)"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('eventType') &&
    (!input.eventType ||
      ![
        'noteon',
        'noteoff',
        'octdown',
        'octup',
        'noteon/noteoff',
        'keypressure',
        'controlchange',
        'programchange',
        'channelpressure',
        'pitchbend',
        'unknown',
      ].includes(input.eventType))
  ) {
    throw new Error(
      'input:default object is missing an eventType property or it is not a valid StatusString'
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('response') &&
    (!input.hasOwnProperty('response') ||
      typeof input.response !== 'string' ||
      !['gate', 'toggle', 'continuous', 'constant'].includes(input.response))
  ) {
    throw new Error(
      "'default' field is missing required field 'response' or it is not a valid string ('gate', 'toggle', 'continuous', 'constant')"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('shape') &&
    (!input.hasOwnProperty('shape') ||
      typeof input.shape !== 'string' ||
      !['circle', 'rect', 'square'].includes(input.shape))
  ) {
    throw new Error(
      "Input is missing required field 'shape' or it is not a valid string ('circle', 'rect', 'square')"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('type') &&
    (!input.hasOwnProperty('type') ||
      typeof input.type !== 'string' ||
      !['pad', 'knob', 'slider', 'wheel', 'xy'].includes(input.type))
  ) {
    throw new Error(
      "Input is missing required field 'type' or it is not a valid string ('pad', 'knob', 'slider', 'wheel', 'xy')"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('overrideable') &&
    (!input.hasOwnProperty('overrideable') ||
      typeof input.overrideable !== 'boolean')
  ) {
    throw new Error(
      "Input is missing required field 'overrideable' or it is not a boolean"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('shape') &&
    (!input.hasOwnProperty('height') || typeof input.height !== 'number')
  ) {
    throw new Error(
      "Input is missing required field 'height' or it is not a number"
    );
  }
  if (
    !ig.inputDefaults.hasOwnProperty('shape') &&
    (!input.hasOwnProperty('width') || typeof input.width !== 'number')
  ) {
    throw new Error(
      "Input is missing required field 'width' or it is not a number"
    );
  }
  if (
    input.hasOwnProperty('handleWidth') &&
    typeof input.handleWidth !== 'number'
  ) {
    throw new Error(
      "'handleWidth' field is not a number or it is not undefined"
    );
  }
  if (
    input.hasOwnProperty('handleHeight') &&
    typeof input.handleHeight !== 'number'
  ) {
    throw new Error("'field is not a number or it is not undefined");
  }
  if (input.hasOwnProperty('value') && typeof input.value !== 'number') {
    throw new Error("'value' field is not a number");
  }

  if (input.hasOwnProperty('availableColors')) {
    if (!Array.isArray(input.availableColors)) {
      throw new Error("'availableColors' field is not an array");
    }
    input.availableColors.forEach((color: any) => {
      validateColor(color);
    });
  }

  if (input.availableFx && !Array.isArray(input.availableFx)) {
    throw new Error(
      'InputConfig object is missing a availableFx property or it is not an array'
    );
  }
  if (input.availableFx && input.availableFx.length > 0) {
    input.availableFx.forEach((fx: FxDriver) => {
      if (!fx.title || typeof fx.title !== 'string') {
        throw new Error(
          'availableFx object is missing a title property or it is not a string'
        );
      }
      if (!fx.effect || typeof fx.effect !== 'string') {
        throw new Error(
          'availableFx object is missing an effect property or it is not a string'
        );
      }
      if (!Array.isArray(fx.validVals) || fx.validVals.length === 0) {
        throw new Error(
          'availableFx object is missing a validVals property or it is not an array of numbers'
        );
      }
      if (typeof fx.defaultVal !== 'number') {
        throw new Error(
          'availableFx object is missing a defaultVal property or it is not a number'
        );
      }
      if (fx.lowBoundLabel && typeof fx.lowBoundLabel !== 'string') {
        throw new Error(
          'availableFx object lowBoundLabel property is not a string'
        );
      }
      if (fx.highBoundLabel && typeof fx.highBoundLabel !== 'string') {
        throw new Error(
          'availableFx object highBoundLabel property is not a string'
        );
      }
    });
  }
}

function validateInputDefaults(
  input: any
): asserts input is InputGridDriver['inputDefaults'] {
  if (
    input.hasOwnProperty('response') &&
    (typeof input.response !== 'string' ||
      !['gate', 'toggle', 'continuous', 'constant'].includes(input.response))
  ) {
    throw new Error(
      "'default' field is missing required field 'response' or it is not a valid string ('gate', 'toggle', 'continuous', 'constant')"
    );
  }

  if (
    input.eventType &&
    ![
      'noteon',
      'noteoff',
      'octdown',
      'octup',
      'noteon/noteoff',
      'keypressure',
      'controlchange',
      'programchange',
      'channelpressure',
      'pitchbend',
      'unknown',
    ].includes(input.eventType)
  ) {
    throw new Error(
      'input:default object is missing an eventType property or it is not a valid StatusString'
    );
  }

  if (
    input.hasOwnProperty('channel') &&
    (typeof input.channel !== 'number' ||
      !(input.channel >= 0 && input.channel <= 15))
  ) {
    throw new Error(
      "'default:channel' field is missing required field 'channel' or it is not a valid channel (0-15)"
    );
  }

  if (input.hasOwnProperty('type')) {
    if (
      typeof input.type !== 'string' ||
      !['pad', 'knob', 'slider', 'wheel', 'xy'].includes(input.type)
    ) {
      throw new Error(
        "Input is missing required field 'type' or it is not a valid string ('pad', 'knob', 'slider', 'wheel', 'xy')"
      );
    }
  }

  if (input.hasOwnProperty('width')) {
    if (typeof input.width !== 'number') {
      throw new Error(
        "Input is missing required field 'width' or it is not a number"
      );
    }
  }

  if (input.hasOwnProperty('height')) {
    if (typeof input.height !== 'number') {
      throw new Error(
        "Input is missing required field 'height' or it is not a number"
      );
    }
  }

  if (input.hasOwnProperty('shape')) {
    if (
      typeof input.shape !== 'string' ||
      !['circle', 'rect', 'square'].includes(input.shape)
    ) {
      throw new Error(
        "Input is missing required field 'shape' or it is not a valid string ('circle', 'rect', 'square')"
      );
    }
  }

  if (input.hasOwnProperty('overrideable')) {
    if (typeof input.overrideable !== 'boolean') {
      throw new Error(
        "Input is missing required field 'overrideable' or it is not a boolean"
      );
    }
  }

  if (input.hasOwnProperty('availableColors')) {
    if (!Array.isArray(input.availableColors)) {
      throw new Error("'availableColors' field is not an array");
    }
    input.availableColors.forEach((color: any) => {
      validateColor(color);
    });
  }
  input.inputs.forEach((inputDriver: any) => {
    try {
      validateInputDriver(inputDriver, input);
    } catch (e: any) {
      throw new Error(`Input Id[${inputDriver.default.number}]: ${e.message}`);
    }
  });
}

function validateInputGridDriver(input: any): asserts input is InputGridDriver {
  if (typeof input !== 'object') {
    throw new Error('Input is not an object');
  }
  if (!input.hasOwnProperty('id') || typeof input.id !== 'string') {
    throw new Error(
      "Input is missing required field 'id' or it is not a string"
    );
  }
  if (!input.hasOwnProperty('height') || typeof input.height !== 'number') {
    throw new Error(
      "Input is missing required field 'height' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('width') || typeof input.width !== 'number') {
    throw new Error(
      "Input is missing required field 'width' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('nRows') || typeof input.nRows !== 'number') {
    throw new Error(
      "Input is missing required field 'nRows' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('nCols') || typeof input.nCols !== 'number') {
    throw new Error(
      "Input is missing required field 'nCols' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('left') || typeof input.left !== 'number') {
    throw new Error(
      "Input is missing required field 'left' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('bottom') || typeof input.bottom !== 'number') {
    throw new Error(
      "Input is missing required field 'bottom' or it is not a number"
    );
  }
  if (!input.hasOwnProperty('inputs') || !Array.isArray(input.inputs)) {
    throw new Error(
      "Input is missing required field 'inputs' or it is not an array"
    );
  }
  if (!input.hasOwnProperty('inputDefaults')) {
    validateInputDefaults(input.inputDefaults);
  }
  input.inputs.forEach((inputDriver: any) => {
    try {
      validateInputDriver(inputDriver, input);
    } catch (e: any) {
      throw new Error(`Input Id[${inputDriver.number}]: ${e.message}`);
    }
  });
}

function validateControlSequenceMessage(
  message: any
): asserts message is DeviceDriver['controlSequence'] {
  if (!Array.isArray(message)) {
    throw new Error('ControlSequenceMessage should be an array');
  }
  if (message[0] < 128 || message[0] > 255) {
    throw new Error(`${message[0]} is an invalid value`);
  }
  if (typeof message[1] !== 'number') {
    throw new Error('ControlSequenceMessage second element should be a number');
  }
}
function validateDeviceStyle(
  style: any
): asserts style is DeviceDriver['style'] {
  if (typeof style !== 'object') {
    throw new Error('DeviceStyle should be an object');
  }
  if (
    style.hasOwnProperty('borderTopLeftRadius') &&
    typeof style.borderTopLeftRadius !== 'string'
  ) {
    throw new Error(
      "DeviceStyle property 'borderTopLeftRadius' should be a string"
    );
  }
  if (
    style.hasOwnProperty('borderTopRightRadius') &&
    typeof style.borderTopRightRadius !== 'string'
  ) {
    throw new Error(
      "DeviceStyle property 'borderTopRightRadius' should be a string"
    );
  }
  if (
    style.hasOwnProperty('borderBottomLeftRadius') &&
    typeof style.borderBottomLeftRadius !== 'string'
  ) {
    throw new Error(
      "DeviceStyle property 'borderBottomLeftRadius' should be a string"
    );
  }
  if (
    style.hasOwnProperty('borderBottomRightRadius') &&
    typeof style.borderBottomRightRadius !== 'string'
  ) {
    throw new Error(
      "DeviceStyle property 'borderBottomRightRadius' should be a string"
    );
  }
}

export function validateDeviceDriver(
  device: any
): asserts device is DeviceDriver {
  if (typeof device !== 'object') {
    throw new Error('Device is not an object');
  }
  if (!device.hasOwnProperty('name') || typeof device.name !== 'string') {
    throw new Error(
      "Device is missing required field 'name' or it is not a string"
    );
  }
  if (
    !device.hasOwnProperty('type') ||
    (device.type !== 'normal' &&
      device.type !== 'adapter' &&
      device.type !== '5pin')
  ) {
    throw new Error(
      "Device is missing required field 'type' or it has an invalid value"
    );
  }
  if (!device.hasOwnProperty('width') || typeof device.width !== 'number') {
    throw new Error(
      "Device is missing required field 'width' or it is not a number"
    );
  }
  if (!device.hasOwnProperty('height') || typeof device.height !== 'number') {
    throw new Error(
      "Device is missing required field 'height' or it is not a number"
    );
  }
  if (
    device.hasOwnProperty('throttle') &&
    typeof device.throttle !== 'number'
  ) {
    throw new Error("Device property 'throttle' should be a number");
  }
  if (!device.hasOwnProperty('style') || typeof device.style !== 'object') {
    throw new Error(
      "Device is missing required field 'style' or it is not an object"
    );
  }
  validateDeviceStyle(device.style);
  if (
    !device.hasOwnProperty('inputGrids') ||
    !Array.isArray(device.inputGrids)
  ) {
    throw new Error(
      "Device is missing required field 'inputGrids' or it is not an array"
    );
  }
  device.inputGrids.forEach((inputGrid: any) => {
    try {
      validateInputGridDriver(inputGrid);
    } catch (e: any) {
      throw new Error(`Input grid: ${inputGrid.id}: ${e.message}`);
    }
  });
  if (
    device.hasOwnProperty('keyboard') &&
    typeof device.keyboard !== 'object'
  ) {
    throw new Error("Device property 'keyboard' should be an object");
  }
  if (device.hasOwnProperty('keyboard')) {
    try {
      validateKeyboardDriver(device.keyboard);
    } catch (e: any) {
      throw new Error(`Keyboard driver: ${e.message}`);
    }
  }
  if (
    device.hasOwnProperty('controlSequence') &&
    !Array.isArray(device.controlSequence)
  ) {
    throw new Error("Device property 'controlSequence' should be an array");
  }
  if (device.hasOwnProperty('controlSequence')) {
    device.controlSequence.forEach((sequence: any) => {
      validateControlSequenceMessage(sequence);
    });
  }
  if (
    device.hasOwnProperty('anonymous') &&
    typeof device.anonymous !== 'boolean'
  ) {
    throw new Error("Device property 'anonymous' should be a boolean");
  }
}
