import add from '../src';

describe('add', () => {
  test('1 + 1 == 2', () => {
    expect(add(1, 1)).toEqual(2);
  });

  test('2 + 2 = 4', () => {
    const sum = add(2, 2);
    expect(sum).toEqual(4);
  });
});
