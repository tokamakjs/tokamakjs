import { flatten } from '../flatten';

describe('flatten', () => {
  it('flattens a recursive array', () => {
    const input = [['a', 'b'], ['c', 'd'], 'e'];
    const output = flatten(input);
    expect(output).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
