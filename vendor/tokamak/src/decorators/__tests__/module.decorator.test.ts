import { module } from '../module.decorator';

describe('@Module', () => {
  @module({
    routing: ['Test' as any],
    providers: ['Test'],
    imports: ['Test'],
    exports: ['Test'],
  })
  class TestModule {}

  it('should add module metadata to the class', () => {
    const routing = Reflect.getMetadata('routing', TestModule);
    const providers = Reflect.getMetadata('providers', TestModule);
    const imports = Reflect.getMetadata('imports', TestModule);
    const exports = Reflect.getMetadata('exports', TestModule);

    expect(routing).toEqual(['Test']);
    expect(providers).toEqual(['Test']);
    expect(imports).toEqual(['Test']);
    expect(exports).toEqual(['Test']);
  });
});
