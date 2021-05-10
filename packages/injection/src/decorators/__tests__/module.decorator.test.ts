import { Reflector } from '../../reflection';
import { ModuleMetadata } from '../../types';
import { Module } from '../module.decorator';

jest.mock('../../reflection');

describe('@tokamakjs/injection', () => {
  describe('decorators/module', () => {
    const moduleMetadata: ModuleMetadata = {
      providers: [],
      imports: [],
      exports: [],
    };

    @Module(moduleMetadata)
    class TestModule {}

    it('adds module metadata to the class using Reflector.', () => {
      expect(Reflector.addModuleMetadata).toHaveBeenCalledWith(TestModule, moduleMetadata);
    });
  });
});
