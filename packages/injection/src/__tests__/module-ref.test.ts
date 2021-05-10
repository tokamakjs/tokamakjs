import { ModuleRef } from '../module-ref';

describe('@tokamakjs/injection', () => {
  describe('ModuleRef', () => {
    class MockModule {
      public container = 'ModuleContainer';

      public resolveToken(token: any) {
        if (token === 'existingProvider') {
          return {
            getInstance: () => 'Provider',
          };
        }

        if (token === 'transientProvider') {
          return {
            isTransient: true,
          };
        }

        if (token === 'unknownProvider') {
          return null;
        }
      }
    }

    const moduleRef = new ModuleRef(new MockModule() as any);

    describe('get container', () => {
      it('returns the wrapped module container', () => {
        expect(moduleRef.container).toBe('ModuleContainer');
      });
    });

    describe('get', () => {
      it('allows resolving a provider from the wrapped module', () => {
        const result = moduleRef.get('existingProvider');
        expect(result).toBe('Provider');
      });

      it('throws an error if no provider is found', () => {
        expect(() => moduleRef.get('unknownProvider')).toThrow(/Provider null/);
      });

      it('throws an error if the scope is transient', () => {
        expect(() => moduleRef.get('transientProvider')).toThrow(/transientProvider is marked/);
      });
    });
  });
});
