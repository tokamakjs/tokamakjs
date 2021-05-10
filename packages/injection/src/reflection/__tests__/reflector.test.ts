import { Injectable, inject } from '../../decorators';
import { Scope } from '../../injection-context';
import { ModuleMetadata } from '../../types';
import { Reflector } from '../reflector';

describe('@tokamakjs/injection', () => {
  describe('Reflector', () => {
    describe('addModuleMetadata', () => {
      class TestModule {}
      class EmptyTestModule {}

      const moduleMetadata: ModuleMetadata = {
        exports: ['Test'],
        imports: ['Test' as any],
        providers: ['Test' as any],
      };

      beforeAll(() => {
        Reflector.addModuleMetadata(TestModule, moduleMetadata);
        Reflector.addModuleMetadata(EmptyTestModule, {});
      });

      it('adds the provided module metadata to target', () => {
        const addedMetadata = Reflect.getMetadata('self:module', TestModule);
        expect(addedMetadata).toEqual(moduleMetadata);
      });

      it('adds defaults to undefined metadata entries', () => {
        const addedMetadata = Reflect.getMetadata('self:module', EmptyTestModule);
        expect(addedMetadata).toEqual({ providers: [], imports: [], exports: [] });
      });
    });

    describe('getModuleMetadata', () => {
      class TestModule {}

      const moduleMetadata: ModuleMetadata = {
        exports: ['Test'],
        imports: ['Test' as any],
        providers: ['Test' as any],
      };

      beforeAll(() => {
        Reflect.defineMetadata('self:module', moduleMetadata, TestModule);
      });

      it('retrieves module metadata from target', () => {
        const metadata = Reflector.getModuleMetadata(TestModule);
        expect(metadata).toEqual(moduleMetadata);
      });
    });

    describe('addProviderMetadata', () => {
      it('adds provider metadata', () => {
        class TestProvider {}

        Reflector.addProviderMetadata(TestProvider, { scope: Scope.TRANSIENT });
        const addedMetadata = Reflect.getMetadata('self:provider', TestProvider);

        expect(addedMetadata).toStrictEqual({ scope: Scope.TRANSIENT });
      });

      it('defaults to singleton if no scope is provided', () => {
        class TestProvider {}

        Reflector.addProviderMetadata(TestProvider, {});
        const addedMetadata = Reflect.getMetadata('self:provider', TestProvider);

        expect(addedMetadata).toStrictEqual({ scope: Scope.SINGLETON });
      });
    });

    describe('getProviderMetadata', () => {
      it('returns provider metadata if found', () => {
        class TestProvider {}

        Reflect.defineMetadata('self:provider', { scope: Scope.SINGLETON }, TestProvider);
        const addedMetadata = Reflector.getProviderMetadata(TestProvider);

        expect(addedMetadata).toStrictEqual({ scope: Scope.SINGLETON });
      });

      it('throws an error if no provider metadata is found', () => {
        class TestProvider {}

        expect(() => Reflector.getProviderMetadata(TestProvider)).toThrow(
          /Could not resolve provider/,
        );
      });
    });

    describe('getConstructorDependencies', () => {
      class TestFoo {}
      class TestBar {}

      @Injectable()
      class TestProvider {
        constructor(
          public foo: TestFoo,
          public bar: TestBar,
          @inject('TEST_BAZ') public baz: string,
        ) {}
      }

      it('retrieves metadata for the arguments of the constructor', () => {
        const dependencies = Reflector.getConstructorDependencies(TestProvider);

        expect(dependencies).toHaveLength(3);
        expect(dependencies[0]).toBe(TestFoo);
        expect(dependencies[1]).toBe(TestBar);
        expect(dependencies[2]).toBe('TEST_BAZ');
      });

      it('returns an empty array if the target is undefined', () => {
        const deps = Reflector.getConstructorDependencies(undefined);

        expect(deps).toEqual([]);
      });
    });

    describe('addManuallyInjectedDeps', () => {
      class TestProvider {}

      it('adds manually injected deps', () => {
        Reflector.addManuallyInjectedDeps(TestProvider, [{ index: 0, token: 'TEST_FOO' }]);
        const deps = Reflect.getMetadata('self:paramtypes', TestProvider);

        expect(deps).toEqual([{ index: 0, token: 'TEST_FOO' }]);
      });

      it('does not remove existing deps when adding new ones', () => {
        Reflector.addManuallyInjectedDeps(TestProvider, [{ index: 1, token: 'TEST_BAR' }]);
        const deps = Reflect.getMetadata('self:paramtypes', TestProvider);

        expect(deps).toEqual([
          { index: 0, token: 'TEST_FOO' },
          { index: 1, token: 'TEST_BAR' },
        ]);
      });
    });

    describe('getManuallyInjectedDeps', () => {
      const injectedDeps = [{ index: 0, token: 'TEST_FOO' }];
      class TestProvider {
        constructor(public readonly test: string) {}
      }
      class EmptyTestProvider {}

      beforeAll(() => {
        Reflect.defineMetadata('self:paramtypes', injectedDeps, TestProvider);
      });

      it('retrieves only the manually injected deps', () => {
        const deps = Reflector.getManuallyInjectedDeps(TestProvider);
        expect(deps).toEqual(injectedDeps);
      });

      it('returns an empty array if no dependencies has been injected', () => {
        const deps = Reflector.getManuallyInjectedDeps(EmptyTestProvider);
        expect(deps).toEqual([]);
      });
    });
  });
});
