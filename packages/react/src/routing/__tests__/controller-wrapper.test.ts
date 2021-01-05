import { WRAPPER_KEY } from '../constants';
import { ControllerWrapper } from '../controller-wrapper';

describe('ControllerWrapper', () => {
  const fakeController = {} as any;
  const wrapper = new ControllerWrapper(fakeController);
  const refreshMock = jest.fn();

  it('defines a wrapper property in the wrapped controller', () => {
    expect(fakeController[WRAPPER_KEY]).toBeDefined();
  });

  it('triggers an error when trying to refresh without having a refreshView function set', () => {
    expect(() => wrapper.refresh()).toThrow(/No refresh function set/);
  });

  it('calls the set refreshView function', () => {
    wrapper.setRefreshViewFunction(refreshMock);
    wrapper.refresh();
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
