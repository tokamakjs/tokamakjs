import { injectable } from '../injectable.decorator';

describe('@injectable', () => {
  @injectable()
  class TestProvider {
    constructor(public testDep: string) {}
  }

  it('should add "design:paramtypes" metadata to the class', () => {
    const metadata = Reflect.getMetadata('design:paramtypes', TestProvider);
    expect(metadata).toBeDefined();
  });
});
