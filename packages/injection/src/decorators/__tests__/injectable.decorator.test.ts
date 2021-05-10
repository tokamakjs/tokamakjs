import { Scope } from '../../injection-context';
import { Reflector } from '../../reflection';
import { Injectable } from '../injectable.decorator';

jest.mock('../../reflection');

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
      @Injectable({ scope: Scope.TRANSIENT })
      class TestProvider {}

      expect(Reflector.addProviderMetadata).toHaveBeenCalledWith(TestProvider, {
        scope: Scope.TRANSIENT,
      });
    });

    describe('getDependencies', () => {
      it('returns constructor dependencies using Reflector', () => {
        class TestProvider {}

        Injectable.getDependencies(TestProvider);

        expect(Reflector.getConstructorDependencies).toHaveBeenCalledWith(TestProvider);
      });
    });
  });
});
