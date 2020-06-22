import { Reflector } from '../../reflection';
import { ModuleMetadata, module } from '../module.decorator';

jest.mock('../../reflection');

describe('@Module', () => {
  const moduleMetadata: ModuleMetadata = {
    routing: [],
    providers: [],
    imports: [],
    exports: [],
  };

  @module(moduleMetadata)
  class TestModule {}

  it('should add module metadata to the class using Reflector.', () => {
    expect(Reflector.addModuleMetadata).toHaveBeenCalledWith(TestModule, moduleMetadata);
  });
});
