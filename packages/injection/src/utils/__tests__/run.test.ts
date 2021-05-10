import { run } from '../run';

describe('tokamakjs/injection', () => {
  describe('utils/run', () => {
    it('returns the result of executing the callback', () => {
      const result = run(() => 'hello world');
      expect(result).toEqual('hello world');
    });
  });
});
