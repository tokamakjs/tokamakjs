import { Reflector } from '../../reflection';
import { ControllerMetadata } from '../../types';
import { Controller } from '../controller.decorator';

jest.mock('../../reflection');

describe.skip('@controller', () => {
  const controllerMetadata: ControllerMetadata = {};

  @Controller(controllerMetadata)
  class TestController {}

  it('should add controller metadata to the class using Reflector', () => {
    expect(Reflector.addControllerMetadata).toHaveBeenCalledWith(
      TestController,
      controllerMetadata,
    );
  });
});
