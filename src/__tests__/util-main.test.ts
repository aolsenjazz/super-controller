import { getDiff } from '../main/util-main';

test('getDiff returns no PortPairs if same list', () => {
  const ids = ['1', '2', '3'];
  const result = getDiff(ids, ids);

  expect(result[0].length).toBe(0);
});

test('getDiff returns 1 pair at first index', () => {
  const ids1 = ['1', '2'];
  const ids2 = ['1'];

  const result = getDiff(ids1, ids2);

  expect(result[0].length).toBe(1);
});

test('getDiff returns 1 pair at second index', () => {
  const ids1 = ['1'];
  const ids2 = ['1', '2'];

  const result = getDiff(ids1, ids2);

  expect(result[1].length).toBe(1);
});
