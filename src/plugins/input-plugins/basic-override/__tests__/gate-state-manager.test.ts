import { PadDriver } from '@shared/driver-types/input-drivers/pad-driver';
import { GateStateManager } from '../state-manager/gate-state-manager';

const driver: PadDriver = {
  type: 'pad',
  number: 0,
  response: 'gate',
  channel: 0,
  status: 'noteon/noteoff',
  availableColors: [],
  availableFx: [],
  interactive: true,
  shape: 'circle',
  width: 1,
  height: 1,
};

const ON = [144, 0, 100] as NumberArrayWithStatus;
const OFF = [128, 0, 0] as NumberArrayWithStatus;

describe('gate->gate', () => {
  it('should flip state for all messages', () => {
    const manager = new GateStateManager(driver);
    expect(manager.state).toBe(0);

    const s1 = manager.process(ON);
    expect(s1).toBe(1);

    const s2 = manager.process(OFF);
    expect(s2).toBe(0);

    const s3 = manager.process(ON);
    expect(s3).toBe(1);
  });
});

describe('gate->toggle', () => {
  it('should only flip for on-messages, return undefined for off', () => {
    const manager = new GateStateManager(driver);
    manager.outputStrategy = 'toggle';
    expect(manager.state).toBe(0);

    const s1 = manager.process(ON);
    expect(s1).toBe(1);

    const s2 = manager.process(OFF);
    expect(s2).toBe(undefined);

    const s3 = manager.process(ON);
    expect(s3).toBe(0);

    const s4 = manager.process(OFF);
    expect(s4).toBe(undefined);

    const s5 = manager.process(ON);
    expect(s5).toBe(1);
  });
});

describe('gate->constant', () => {
  it('should repeat 0 for every on message, undefined for off', () => {
    const manager = new GateStateManager(driver);
    manager.outputStrategy = 'constant';
    expect(manager.state).toBe(0);

    const s1 = manager.process(ON);
    expect(s1).toBe(0);

    const s2 = manager.process(OFF);
    expect(s2).toBe(undefined);

    const s3 = manager.process(ON);
    expect(s3).toBe(0);

    const s4 = manager.process(OFF);
    expect(s4).toBe(undefined);

    const s5 = manager.process(ON);
    expect(s5).toBe(0);
  });
});

describe('gate->n-step', () => {
  it('should handle 3 states correctly', () => {
    const manager = new GateStateManager(driver);
    manager.outputStrategy = 'n-step';
    manager.totalStates = 3;
    expect(manager.state).toBe(0);

    const s1 = manager.process(ON);
    expect(s1).toBe(1);

    const s2 = manager.process(OFF);
    expect(s2).toBe(undefined);

    const s3 = manager.process(ON);
    expect(s3).toBe(2);

    const s4 = manager.process(OFF);
    expect(s4).toBe(undefined);

    const s5 = manager.process(ON);
    expect(s5).toBe(0);

    const s6 = manager.process(OFF);
    expect(s6).toBe(undefined);

    const s7 = manager.process(ON);
    expect(s7).toBe(1);
  });
});
