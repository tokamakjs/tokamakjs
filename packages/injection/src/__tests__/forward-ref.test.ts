import { forwardRef } from '../forward-ref';

describe('@tokamakjs/injection', () => {
  describe('forwardRef', () => {
    it('creates a forward reference', () => {
      const fn = jest.fn();
      const result = forwardRef(fn);

      expect(result).toEqual({ forwardRef: fn });
    });
  });
});
