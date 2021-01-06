import { WRAPPER_KEY } from '../../routing';
import { observable } from '../observable.decorator';

describe('@observable', () => {
  class TestController {
    @observable public test = 'hello';
  }

  it('should set target property as observable', () => {
    const testController = new TestController();
    const refreshMock = jest.fn();

    (testController as any)[WRAPPER_KEY] = { refresh: refreshMock };

    expect(testController.test).toBe('hello');

    testController.test = 'bye';

    expect(testController.test).toBe('bye');
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
