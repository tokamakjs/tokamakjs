/* eslint-disable no-use-before-define, jest/no-disabled-tests */

import { Injectable, Module as ModuleDecorator, inject } from '../decorators';
import { DiContainer } from '../di-container';
import { forwardRef } from '../forward-ref';
import { Scope } from '../injection-context';
import { Module } from '../module';
import { ProviderWrapper } from '../provider-wrapper';

/**
 * This looks more like an integration test since we're using
 * other units of code. However, providing a fully unitary testing
 * environment would be too costly and up to a certain extend, pointless.
 */
describe('@tokamakjs/injection', () => {
  describe('DiContainer', () => {
    @Injectable()
    class TestProvider {}

    @Injectable({ scope: Scope.TRANSIENT })
    class TestTransientProvider {}

    @Injectable()
    class TestImportedProvider {}

    @ModuleDecorator({ providers: [TestImportedProvider] })
    class TestImportedModule {}

    const AsyncProvider = {
      provide: 'ASYNC_PROVIDER',
      useFactory: async () => 'async-value',
      scope: Scope.SINGLETON,
    };

    const TransientAsyncProvider = {
      provide: 'TRANSIENT_ASYNC_PROVIDER',
      useFactory: async () => 'transient-async-value',
      scope: Scope.TRANSIENT,
    };

    @ModuleDecorator({
      providers: [TestProvider, TestTransientProvider, AsyncProvider, TransientAsyncProvider],
      imports: [TestImportedModule],
    })
    class TestModule {}

    let container: DiContainer;

    beforeAll(async () => {
      container = await DiContainer.from(TestModule);
    });

    describe('from', () => {
      it('returns a DiContainer instance', async () => {
        expect(container).toBeDefined();
      });

      it('marks the container as initialized', () => {
        expect(container.isInitialized).toBe(true);
      });

      it('exposes the global module', () => {
        expect(container.globalModule).toBeInstanceOf(Module);
      });

      it('exposes the registered providers', () => {
        expect(container.providers).toBeInstanceOf(Map);
        expect(container.providers.get(TestProvider)).toBeInstanceOf(ProviderWrapper);
      });

      it('exposes the providers from imported modules', () => {
        expect(container.providers).toBeInstanceOf(Map);
        expect(container.providers.get(TestImportedProvider)).toBeInstanceOf(ProviderWrapper);
      });
    });

    describe('get', () => {
      it('returns an instance of the provider identified by the token', () => {
        const result = container.get(TestProvider);

        expect(result).toBeInstanceOf(TestProvider);
      });

      it('throws an error if the provider could not be found', () => {
        class UnknownProvider {}

        expect(() => container.get(UnknownProvider)).toThrow(/Could not find/);
      });

      it('throws an error if the provider is transient', () => {
        expect(() => container.get(TestTransientProvider)).toThrow(/Transient scoped providers/);
      });
    });

    describe('resolve', () => {
      it('returns an instance of the provider identified by the token', async () => {
        const result = await container.resolve(TestTransientProvider);

        expect(result).toBeInstanceOf(TestTransientProvider);
      });

      it('returns instances of async providers', async () => {
        const result = await container.resolve(AsyncProvider.provide);

        expect(result).toBe('async-value');
      });

      it('returns instances of transient async providers', async () => {
        const result = await container.resolve(TransientAsyncProvider.provide);

        expect(result).toBe('transient-async-value');
      });

      describe('for the same context', () => {
        it('returns a singleton instance if a singleton provider is required', async () => {
          const foo = await container.resolve(TestProvider);
          const bar = await container.resolve(TestProvider);

          expect(foo).toBe(bar);
        });

        it('returns the same singleton instance even if a different inquirer is used', async () => {
          const context = { id: 'context' };

          const foo = await container.resolve(TestProvider, context, {});
          const bar = await container.resolve(TestProvider, context, {});

          expect(foo).toBe(bar);
        });

        it('returns the same instance of a transient provider if the same inquirer is used', async () => {
          const context = { id: 'context' };
          const inquirer = {};

          const foo = await container.resolve(TestTransientProvider, context, inquirer);
          const bar = await container.resolve(TestTransientProvider, context, inquirer);

          expect(foo).toBe(bar);
        });

        it('returns a different instance of a transient provider if a different inquirer is used', async () => {
          const context = { id: 'context' };

          const foo = await container.resolve(TestTransientProvider, context, {});
          const bar = await container.resolve(TestTransientProvider, context, {});

          expect(foo).not.toBe(bar);
        });
      });

      describe('for different contexts', () => {
        it('returns a different singleton instance', async () => {
          const fooContext = { id: 'foo' };
          const barContext = { id: 'bar' };
          const foo1 = await container.resolve(TestProvider, fooContext);
          const foo2 = await container.resolve(TestProvider, fooContext);

          const bar1 = await container.resolve(TestProvider, barContext);
          const bar2 = await container.resolve(TestProvider, barContext);

          expect(foo1).toBe(foo2);
          expect(bar2).toBe(bar2);
          expect(foo1).not.toBe(bar1);
          expect(foo2).not.toBe(bar2);
        });

        it('returns different instances of a transient provider even if the same inquirer is used', async () => {
          const fooContext = { id: 'foo' };
          const barContext = { id: 'bar' };

          const inquirer = {};

          const foo = await container.resolve(TestTransientProvider, fooContext, inquirer);
          const bar = await container.resolve(TestTransientProvider, barContext, inquirer);

          expect(foo).not.toBe(bar);
        });
      });
    });

    describe('resolveSync', () => {
      it('returns an instance of the provider identified by the token', () => {
        const result = container.resolveSync(TestTransientProvider);

        expect(result).toBeInstanceOf(TestTransientProvider);
      });

      it('returns instances of singleton async providers', () => {
        const result = container.resolveSync(AsyncProvider.provide);
        expect(result).toBe('async-value');
      });

      it('throws an error if a transient async provider is tried to be resolved', () => {
        expect(() => container.resolveSync(TransientAsyncProvider.provide)).toThrow(
          /Cannot resolve async provider/,
        );
      });

      describe('for the same context', () => {
        it('returns a singleton instance if a singleton provider is required', () => {
          const foo = container.resolveSync(TestProvider);
          const bar = container.resolveSync(TestProvider);

          expect(foo).toBe(bar);
        });

        it('returns the same singleton instance even if a different inquirer is used', () => {
          const context = { id: 'context' };

          const foo = container.resolveSync(TestProvider, context, {});
          const bar = container.resolveSync(TestProvider, context, {});

          expect(foo).toBe(bar);
        });

        it('returns the same instance of a transient provider if the same inquirer is used', () => {
          const context = { id: 'context' };
          const inquirer = {};

          const foo = container.resolveSync(TestTransientProvider, context, inquirer);
          const bar = container.resolveSync(TestTransientProvider, context, inquirer);

          expect(foo).toBe(bar);
        });

        it('returns a different instance of a transient provider if a different inquirer is used', () => {
          const context = { id: 'context' };

          const foo = container.resolveSync(TestTransientProvider, context, {});
          const bar = container.resolveSync(TestTransientProvider, context, {});

          expect(foo).not.toBe(bar);
        });
      });

      describe('for different contexts', () => {
        it('returns a different singleton instance', () => {
          const fooContext = { id: 'foo' };
          const barContext = { id: 'bar' };
          const foo1 = container.resolveSync(TestProvider, fooContext);
          const foo2 = container.resolveSync(TestProvider, fooContext);

          const bar1 = container.resolveSync(TestProvider, barContext);
          const bar2 = container.resolveSync(TestProvider, barContext);

          expect(foo1).toBe(foo2);
          expect(bar2).toBe(bar2);
          expect(foo1).not.toBe(bar1);
          expect(foo2).not.toBe(bar2);
        });

        it('returns different instances of a transient provider even if the same inquirer is used', () => {
          const fooContext = { id: 'foo' };
          const barContext = { id: 'bar' };

          const inquirer = {};

          const foo = container.resolveSync(TestTransientProvider, fooContext, inquirer);
          const bar = container.resolveSync(TestTransientProvider, barContext, inquirer);

          expect(foo).not.toBe(bar);
        });
      });
    });

    describe('resolveDependencies', () => {
      it('returns an instance of the passed provider with all dependencies resolved from the container', async () => {
        @Injectable()
        class Foo {
          constructor(
            public readonly provider: TestProvider,
            public readonly transientProvider: TestTransientProvider,
            @inject(AsyncProvider.provide) public readonly asyncProvider: string,
            @inject(TransientAsyncProvider.provide) public readonly transientAsyncProvider: string,
          ) {}
        }

        const result = await container.resolveDependencies(Foo);
        expect(result.provider).toBeInstanceOf(TestProvider);
        expect(result.transientProvider).toBeInstanceOf(TestTransientProvider);
        expect(result.asyncProvider).toBe('async-value');
        expect(result.transientAsyncProvider).toBe('transient-async-value');
      });
    });

    describe('resolveDepsSync', () => {
      it('returns an instance of the passed sync provider with all dependencies resolved from the container', () => {
        @Injectable()
        class Foo {
          constructor(
            public readonly provider: TestProvider,
            public readonly transientProvider: TestTransientProvider,
            @inject(AsyncProvider.provide) public readonly asyncProvider: string,
          ) {}
        }

        const result = container.resolveDepsSync(Foo);

        expect(result.provider).toBeInstanceOf(TestProvider);
        expect(result.transientProvider).toBeInstanceOf(TestTransientProvider);
        expect(result.asyncProvider).toBe('async-value');
      });

      it('throws an error if an async provider is tried to be resolved', () => {
        @Injectable()
        class Foo {
          constructor(
            @inject(TransientAsyncProvider.provide) public readonly transientAsyncProvider: string,
          ) {}
        }

        expect(() => container.resolveDepsSync(Foo)).toThrow(/Cannot resolve async provider/);
      });
    });

    it.skip('throws an error if circular dependencies are present', async () => {
      // TODO: Fix early reference error
      @Injectable()
      class FooProvider {
        constructor(public bar: BarProvider) {}
      }

      @Injectable()
      class BarProvider {
        constructor(public foo: FooProvider) {}
      }

      @ModuleDecorator({ providers: [FooProvider, BarProvider] })
      class TestModule {}

      const di = await DiContainer.from(TestModule);

      await expect(di.resolve(BarProvider)).rejects.toThrow(
        /circular dependency has been detected/,
      );
    });

    it('resolves circular dependencies in modules if forwardRef is used', async () => {
      @Injectable()
      class FooProvider {}

      @Injectable()
      class BarProvider {}

      @ModuleDecorator({
        providers: [FooProvider],
        imports: [forwardRef(() => BarModule)],
      })
      class FooModule {}

      @ModuleDecorator({
        providers: [BarProvider],
        imports: [forwardRef(() => FooModule)],
      })
      class BarModule {}

      @ModuleDecorator({ imports: [FooModule, BarModule] })
      class TestModule {}

      const container = await DiContainer.from(TestModule);
      const foo = container.get(FooProvider);
      const bar = container.get(BarProvider);

      expect(foo).toBeInstanceOf(FooProvider);
      expect(bar).toBeInstanceOf(BarProvider);
    });

    // TODO: For now, forwardRef only works for modules
    it.skip('resolves circular dependencies in providers if forwardRef is used', async () => {
      @Injectable()
      class FooProvider {
        constructor(@inject(forwardRef(() => BarProvider)) public bar: BarProvider) {}
      }

      @Injectable()
      class BarProvider {
        constructor(@inject(forwardRef(() => FooProvider)) public foo: FooProvider) {}
      }

      @ModuleDecorator({ providers: [FooProvider, BarProvider] })
      class TestModule {}

      const container = await DiContainer.from(TestModule);
      const foo = container.get(FooProvider);
      const bar = container.get(BarProvider);

      expect(foo.bar).toBeInstanceOf(BarProvider);
      expect(bar.foo).toBeInstanceOf(FooProvider);
    });

    it('throws if a provider with an undefined dependency is resolved', async () => {
      class FooProvider {}

      @Injectable()
      class BarProvider {
        constructor(public foo: FooProvider) {}
      }

      @ModuleDecorator({ providers: [BarProvider] })
      class TestModule {}

      await expect(() => DiContainer.from(TestModule)).rejects.toThrow(/Cannot find FooProvider/);
    });
  });
});
