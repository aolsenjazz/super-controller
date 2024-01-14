import { ThreeByteMidiArray } from '@shared/midi-array';
import { DeviceConfig } from '@shared/hardware-config/device-config';

class DeviceConfigWrapper extends DeviceConfig {
  isAdapter = false;

  applyOverrides(msg: ThreeByteMidiArray) {
    return msg;
  }

  getResponse() {
    return undefined;
  }

  get stub() {
    return {
      id: '',
      portName: '',
      siblingIndex: 0,
      driverName: '',
      nickname: '',
    };
  }
}

test('constructor sets values correctly', () => {
  const name = 'test';
  const siblingIndex = 7;
  const nickname = 'nick';
  const dev = new DeviceConfigWrapper(name, name, siblingIndex, nickname);

  expect(dev.portName).toBe(name);
  expect(dev.siblingIndex).toBe(siblingIndex);
  expect(dev.nickname).toBe(nickname);
});

test('with unset nickname, device.nickname returns name', () => {
  const name = 'test';
  const siblingIndex = 7;
  const dev = new DeviceConfigWrapper(name, name, siblingIndex);

  expect(dev.nickname).toBe(name);
});
