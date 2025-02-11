import { TriggerStateManager } from '../state-manager/trigger-state-manager';

describe('toggle->toggle', () => {
  it('should flip state for all messages', () => {
    const manager = new TriggerStateManager('toggle');
    expect(manager.state).toBe(0);

    const s1 = manager.process();
    expect(s1).toBe(1);

    const s2 = manager.process();
    expect(s2).toBe(0);

    const s3 = manager.process();
    expect(s3).toBe(1);
  });
});

describe('toggle->constant', () => {
  it('should repeat 0 for every on message, undefined for off', () => {
    const manager = new TriggerStateManager('toggle');
    manager.outputStrategy = 'constant';
    expect(manager.state).toBe(0);

    const s1 = manager.process();
    expect(s1).toBe(0);

    const s2 = manager.process();
    expect(s2).toBe(0);

    const s3 = manager.process();
    expect(s3).toBe(0);

    const s4 = manager.process();
    expect(s4).toBe(0);

    const s5 = manager.process();
    expect(s5).toBe(0);
  });
});

describe('toggle->n-step', () => {
  it('should handle 3 states correctly', () => {
    const manager = new TriggerStateManager('toggle');
    manager.outputStrategy = 'n-step';
    manager.totalStates = 3;
    expect(manager.state).toBe(0);

    const s1 = manager.process();
    expect(s1).toBe(1);

    const s2 = manager.process();
    expect(s2).toBe(2);

    const s3 = manager.process();
    expect(s3).toBe(0);

    const s4 = manager.process();
    expect(s4).toBe(1);

    const s5 = manager.process();
    expect(s5).toBe(2);

    const s6 = manager.process();
    expect(s6).toBe(0);

    const s7 = manager.process();
    expect(s7).toBe(1);
  });
});
