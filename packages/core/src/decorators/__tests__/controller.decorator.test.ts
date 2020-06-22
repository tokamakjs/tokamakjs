import { Reflector } from '../../reflection';
import { ControllerMetadata, controller } from '../controller.decorator';

jest.mock('../../reflection');

describe('@controller', () => {
  const controllerMetadata: ControllerMetadata = {
    view: () => null,
  };

  @controller(controllerMetadata)
  class TestController {}

  it('should add controller metadata to the class using Reflector', () => {
    expect(Reflector.addControllerMetadata).toHaveBeenCalledWith(
      TestController,
      controllerMetadata,
    );
  });
});
