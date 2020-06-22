import { isFunction } from '../is-function';

describe('isFunction', () => {
  it('returns true when the passed argument is a function', () => {
    expect(isFunction(() => null)).toBe(true);
    expect(isFunction(function () {})).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(isFunction(true)).toBe(false);
    expect(isFunction(false)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction('hello')).toBe(false);
    expect(isFunction(1)).toBe(false);
  });
});
