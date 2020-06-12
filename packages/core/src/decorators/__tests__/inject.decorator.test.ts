import { Reflector } from '../../reflection';
import { inject } from '../inject.decorator';

jest.mock('../../reflection');

describe('@inject', () => {
  it('should add the injected deps to the class metadata using Reflector', () => {
    class TestProvider {
      constructor(@inject('TEST_DEP') public testFoo: string) {}
    }

    expect(Reflector.addManuallyInjectedDeps).toHaveBeenCalledWith(TestProvider, [
      {
        index: 0,
        token: 'TEST_DEP',
      },
    ]);
  });
});
