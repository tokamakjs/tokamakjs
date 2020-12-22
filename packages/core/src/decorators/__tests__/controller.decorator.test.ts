import { Reflector } from '../../reflection';
import { Controller, ControllerMetadata } from '../controller.decorator';

jest.mock('../../reflection');

describe('@controller', () => {
  const controllerMetadata: ControllerMetadata = {
    view: () => null,
  };

  @Controller(controllerMetadata)
  class TestController {}

  it('should add controller metadata to the class using Reflector', () => {
    expect(Reflector.addControllerMetadata).toHaveBeenCalledWith(
      TestController,
      controllerMetadata,
    );
  });
});
