import { ControllerWrapper, WRAPPER_KEY } from '../controller-wrapper';

describe('ControllerWrapper', () => {
  const fakeController = {} as any;
  const wrapper = new ControllerWrapper(fakeController);
  const refreshMock = jest.fn();

  it('defines a wrapper property in the wrapped controller', () => {
    expect(fakeController[WRAPPER_KEY]).toBeDefined();
  });

  it('is instantiated with hasRendered false', () => {
    expect(wrapper.hasRendered).toBe(false);
  });

  it('sets hasRendered as true after being mounted', () => {
    wrapper.onDidMount();
    expect(wrapper.hasRendered).toBe(true);
  });

  it('sets hasRendered as false after it is unmounted', () => {
    wrapper.onWillUnmount();
    expect(wrapper.hasRendered).toBe(false);
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
