import { ControllerWrapper, WRAPPER_KEY } from '../controller-wrapper';

describe('ControllerWrapper', () => {
  it('defines a wrapper property in the wrapped controller', () => {
    const fakeController = {} as any;
    new ControllerWrapper(fakeController);
    expect(fakeController[WRAPPER_KEY]).toBeDefined();
  });
});
