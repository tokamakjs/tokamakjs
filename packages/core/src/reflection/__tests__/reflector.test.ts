import { ControllerMetadata, ModuleMetadata, inject, injectable } from '../../decorators';
import { Reflector } from '../reflector';

describe('Reflector', () => {
  describe('addModuleMetadata', () => {
    class TestModule {}
    class EmptyTestModule {}

    const moduleMetadata: ModuleMetadata = {
      routing: ['Test' as any],
      exports: ['Test'],
      imports: ['Test'],
      providers: ['Test'],
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
      expect(addedMetadata).toEqual({ routing: [], providers: [], imports: [], exports: [] });
    });
  });

  describe('getModuleMetadata', () => {
    class TestModule {}

    const moduleMetadata: ModuleMetadata = {
      routing: ['Test' as any],
      exports: ['Test'],
      imports: ['Test'],
      providers: ['Test'],
    };

    beforeAll(() => {
      Reflect.defineMetadata('self:module', moduleMetadata, TestModule);
    });

    it('retrieves module metadata from target', () => {
      const metadata = Reflector.getModuleMetadata(TestModule);
      expect(metadata).toEqual(moduleMetadata);
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
    class TestProvider {}
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

  describe('getConstructorDependencies', () => {
    class TestFoo {}
    class TestBar {}

    @injectable()
    class TestProvider {
      constructor(
        public foo: TestFoo,
        public bar: TestBar,
        @inject('TEST_BAZ') public baz: string,
      ) {}
    }

    it('retrieves the metadata for the arguments of the constructor', () => {
      const dependencies = Reflector.getConstructorDependencies(TestProvider);
      expect(dependencies.length).toBe(3);
      expect(dependencies[0]).toBe(TestFoo);
      expect(dependencies[1]).toBe(TestBar);
      expect(dependencies[2]).toBe('TEST_BAZ');
    });
  });

  describe('addControllerMetadata', () => {
    it('adds the provided metadata to the controller', () => {
      class TestController {}
      const controllerMetadata: ControllerMetadata = { view: () => null };

      Reflector.addControllerMetadata(TestController, controllerMetadata);

      const addedMetadata = Reflect.getMetadata('self:controller', TestController);
      expect(addedMetadata).toEqual(controllerMetadata);
    });
  });

  describe('getControllerMetadata', () => {
    it('gets controller metadata from the provided metatype', () => {
      class TestController {}
      const controllerMetadata: ControllerMetadata = { view: () => null };

      Reflect.defineMetadata('self:controller', controllerMetadata, TestController);

      const addedMetadata = Reflector.getControllerMetadata(TestController);
      expect(addedMetadata).toEqual(controllerMetadata);
    });
  });

  describe('isController', () => {
    it('returns true if the target has been decorated with a @controller decorator', () => {
      class TestController {}
      const controllerMetadata: ControllerMetadata = { view: () => null };

      Reflect.defineMetadata('self:controller', controllerMetadata, TestController);

      const isController = Reflector.isController(TestController);
      expect(isController).toBe(true);
    });
  });
});
