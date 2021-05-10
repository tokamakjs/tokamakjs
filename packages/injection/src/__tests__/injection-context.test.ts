import { createInjectionContext } from '../injection-context';

describe('@tokamakjs/injection', () => {
  describe('createInjectionContext', () => {
    it('creates a valid injection context', () => {
      const result = createInjectionContext();
      expect(result.id).toBeDefined();
    });

    it('creates a new random injection context every time is called', () => {
      const foo = createInjectionContext();
      const bar = createInjectionContext();
      expect(foo.id).not.toEqual(bar.id);
    });
  });
});
