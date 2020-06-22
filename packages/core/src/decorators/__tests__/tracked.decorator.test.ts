import { BehaviorSubject } from 'rxjs';

import { Tracked, tracked } from '../tracked.decorator';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

describe('@tracked', () => {
  class TestController {
    @tracked async testLoad() {
      await delay(2000);
    }
  }

  it('should add a hidden "__isPending$__" property to target', () => {
    const testController = new TestController() as Tracked<TestController>;
    const isLoadingDescriptor = Object.getOwnPropertyDescriptor(
      TestController.prototype,
      '__isPending$__',
    );

    expect(isLoadingDescriptor).toMatchObject({
      writable: false,
      enumerable: false,
      configurable: false,
    });
    expect(testController.__isPending$__).toBeInstanceOf(BehaviorSubject);
  });

  it('should set target async method as tracked', async () => {
    const testController = new TestController() as Tracked<TestController>;
    const observerMock = jest.fn();

    testController.__isPending$__.subscribe(observerMock);
    await testController.testLoad();
    await testController.testLoad();

    expect(observerMock).toHaveBeenCalledTimes(5);
    expect(observerMock.mock.calls[0][0]).toBe(false);
    expect(observerMock.mock.calls[1][0]).toBe(true);
    expect(observerMock.mock.calls[2][0]).toBe(false);
    expect(observerMock.mock.calls[3][0]).toBe(true);
    expect(observerMock.mock.calls[4][0]).toBe(false);
  });
});
