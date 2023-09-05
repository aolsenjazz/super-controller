import {
  AdapterDeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { parse } from '@shared/util';

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const supported = new SupportedDeviceConfig(
      'supported',
      'supported',
      0,
      [],
      []
    );
    const conf = new AdapterDeviceConfig('test', 'test', 0, supported);
    const json = JSON.stringify(conf);
    const result = parse<AdapterDeviceConfig>(json);

    expect(JSON.stringify(result.child)).toBe(JSON.stringify(supported));
    expect(conf.id).toBe(result.id);
  });
});
