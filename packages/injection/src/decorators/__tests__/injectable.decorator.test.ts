import { jest } from '@jest/globals';

import { Scope } from '../../injection-context';
import { Reflector } from '../../reflection';
import { Injectable } from '../injectable.decorator';

describe('@tokamakjs/injection', () => {
  describe('decorators/injectable', () => {
    it('adds "design:paramtypes" metadata to the class', () => {
      @Injectable()
      class TestProvider {
        constructor(public readonly test: string) {}
      }

      const metadata = Reflect.getMetadata('design:paramtypes', TestProvider);
      expect(metadata).toBeDefined();
    });

    it('adds the provided metadata to the class using Reflector', () => {
      const addMetadataMock = jest.spyOn(Reflector, 'addProviderMetadata');

      @Injectable({ scope: Scope.TRANSIENT })
      class TestProvider {}

      expect(addMetadataMock).toHaveBeenCalledWith(TestProvider, { scope: Scope.TRANSIENT });
      expect(Reflector.getProviderMetadata(TestProvider)).toEqual({ scope: Scope.TRANSIENT });
    });

    describe('getDependencies', () => {
      it('returns constructor dependencies using Reflector', () => {
        const getConstructorDependenciesMock = jest.spyOn(Reflector, 'getConstructorDependencies');

        class TestProvider {}

        Injectable.getDependencies(TestProvider);

        expect(getConstructorDependenciesMock).toHaveBeenCalledWith(TestProvider);
      });
    });
  });
});
