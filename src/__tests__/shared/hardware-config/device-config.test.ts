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
      isAdapter: false,
      isSupported: true,
      isAnonymous: false,
      isAdapterChildSet: false,
      shareSustain: [],
    };
  }
}

test('constructor sets values correctly', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain = ['otherDevice'];
  const nickname = 'nick';
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain,
    nickname
  );

  expect(dev.portName).toBe(name);
  expect(dev.siblingIndex).toBe(siblingIndex);
  expect(dev.supported).toBe(supported);
  expect(dev.shareSustain).toEqual(shareSustain);
  expect(dev.nickname).toBe(nickname);
});

test('with unset nickname, device.nickname returns name', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain = ['otherDevice'];
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain
  );

  expect(dev.nickname).toBe(name);
});

test('sharing with returns true', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain = ['otherDevice'];
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain
  );

  expect(dev.sharingWith('otherDevice')).toBe(true);
});

test('sharing with returns false', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain = ['otherDevice'];
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain
  );

  expect(dev.sharingWith('badOtherDevice')).toBe(false);
});

test('stop sharing with removes device from array', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain = ['otherDevice'];
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain
  );
  dev.stopSharing('otherDevice');
  expect(dev.sharingWith('otherDevice')).toBe(false);
});

test('shareWith add device to array', () => {
  const name = 'test';
  const siblingIndex = 7;
  const supported = true;
  const shareSustain: string[] = [];
  const dev = new DeviceConfigWrapper(
    name,
    name,
    siblingIndex,
    supported,
    shareSustain
  );
  dev.shareWith('otherDevice');
  expect(dev.sharingWith('otherDevice')).toBe(true);
});
