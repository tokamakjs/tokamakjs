import { jest } from '@jest/globals';

import { Reflector } from '../../reflection';
import { inject } from '../inject.decorator';

describe('@tokamakjs/injection', () => {
  describe('decorators/inject', () => {
    it('adds the injected deps to the class metadata using Reflector', () => {
      const addDepsMock = jest.spyOn(Reflector, 'addManuallyInjectedDeps');

      class TestProvider {
        constructor(@inject('TEST_DEP') public testFoo: string) {}
      }

      expect(addDepsMock).toHaveBeenCalledWith(TestProvider, [{ index: 0, token: 'TEST_DEP' }]);
      expect(Reflector.getManuallyInjectedDeps(TestProvider)).toEqual([
        { index: 0, token: 'TEST_DEP' },
      ]);
    });
  });
});
