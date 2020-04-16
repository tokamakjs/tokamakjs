import { injectable } from '../injectable.decorator';

describe('@injectable', () => {
  @injectable()
  class Test {
    constructor(public foo: number, public bar: string) {}
  }

  it('should add "design:paramtypes" metadata', () => {
    const params = Reflect.getMetadata('design:paramtypes', Test);

    expect(params).toHaveLength(2);
    expect(params[0]).toEqual(Number);
    expect(params[1]).toEqual(String);
  });
});
