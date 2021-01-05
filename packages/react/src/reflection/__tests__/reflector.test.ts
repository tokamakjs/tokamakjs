import { ControllerMetadata } from '../../types';
import { Reflector } from '../reflector';

describe('Reflector', () => {
  describe('addControllerMetadata', () => {
    it('adds the provided metadata to the controller', () => {
      class TestController {}
      const controllerMetadata: ControllerMetadata = { view: () => null };

      Reflector.addControllerMetadata(TestController, controllerMetadata);

      const addedMetadata = Reflect.getMetadata('self:controller', TestController);
      expect(addedMetadata).toEqual(controllerMetadata);
    });
  });

  describe('getControllerMetadata', () => {
    it('gets controller metadata from the provided metatype', () => {
      class TestController {}
      const controllerMetadata: ControllerMetadata = { view: () => null };

      Reflect.defineMetadata('self:controller', controllerMetadata, TestController);

      const addedMetadata = Reflector.getControllerMetadata(TestController);
      expect(addedMetadata).toEqual(controllerMetadata);
    });
  });
});
