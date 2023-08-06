describe('fromDriver', () => {
  test('set values correctly', () => {});
});

describe('toJSON', () => {
  test('de/serializes correctly', () => {});
});

describe('restoreDefaults', () => {
  test('restores default value', () => {});
});

describe('eligibleResponses', () => {
  test('returns correct values for r = gate', () => {});
  test('returns correct values for r = toggle', () => {});
  test('returns correct values for r = constant', () => {});
  test('throws for r = continuous', () => {});
});

describe('eligibleStatusStrings', () => {
  test('returns correct vals for r = constant', () => {});
  test('returns correct values for r != constant', () => {});
});

describe('eligibleLightResponses', () => {
  test('returns correct vals for r = toggle', () => {});
  test('returns correct vals for r = constant', () => {});
  test('returns correct vals for r = gate', () => {});
});

describe('set response', () => {
  test('going from gate -> constant changes statusString to noteon', () => {});
  test('going from constant -> changes status to noteon/noteoff', () => {});
  test('going from gate->sets deviceProp outputResponse to gate', () => {});
  test('resets deviceProp state', () => {});
  test('sets outputProp response', () => {});
});
