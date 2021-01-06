import { Reflector } from '../../reflection';
import { ModuleMetadata } from '../../types';
import { Module } from '../module.decorator';

jest.mock('../../reflection');

describe('@Module', () => {
  const moduleMetadata: ModuleMetadata = {
    providers: [],
    imports: [],
    exports: [],
  };

  @Module(moduleMetadata)
  class TestModule {}

  it('should add module metadata to the class using Reflector.', () => {
    expect(Reflector.addModuleMetadata).toHaveBeenCalledWith(TestModule, moduleMetadata);
  });
});
