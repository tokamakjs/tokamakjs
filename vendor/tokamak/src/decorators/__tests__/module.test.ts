import { Module } from '../module';

describe('@Module', () => {
  it('should enhance class with expected module metadata', () => {
    @Module({
      routing: ['Test'],
      providers: ['Test'],
      imports: ['Test'],
      exports: ['Test'],
    })
    class TestModule {}

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
