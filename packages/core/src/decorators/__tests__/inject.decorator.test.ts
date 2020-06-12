import { Reflector } from '../../reflection';
import { inject } from '../inject.decorator';

jest.mock('../../reflection');

describe('@inject', () => {
  class TestProvider {
    constructor(@inject('TEST_DEP') public testDep: string) {}
  }

  it('should add the injected deps to the class metadata using Reflector', () => {
    expect(Reflector.addManuallyInjectedDeps).toHaveBeenCalledWith(TestProvider, [
      {
        index: 0,
        token: 'TEST_DEP',
      },
    ]);
  });
});
