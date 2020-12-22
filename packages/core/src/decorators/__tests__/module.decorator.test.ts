import { Reflector } from '../../reflection';
import { Module, ModuleMetadata } from '../module.decorator';

jest.mock('../../reflection');

describe('@Module', () => {
  const moduleMetadata: ModuleMetadata = {
    routing: [],
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
