import { WithHooks, onDidMount, onDidRender, onWillUnmount } from '../controller-life-cycle';

describe('controller-life-cycle', () => {
  class TestController {
    @onDidMount()
    onDidMountHook() {}

    @onWillUnmount()
    onWillUnmountHook() {}

    @onDidRender()
    onDidRenderHook() {}
  }

  const controller = (new TestController() as unknown) as TestController & WithHooks;

  describe('@onDidMount', () => {
    it('should add the decorated method to the list of onDidMount hooks', () => {
      expect(controller.__hooks__.get('onDidMount')).toEqual([
        controller.onDidMountHook.bind(controller),
      ]);
    });
  });

  describe('@onWillUnmount', () => {
    it('should add the decorated method to the list of onWillUnmount hooks', () => {
      expect(controller.__hooks__.get('onWillUnmount')).toEqual([
        controller.onWillUnmountHook.bind(controller),
      ]);
    });
  });

  describe('@onDidRender', () => {
    it('should add the decorated method to the list of onDidRender hooks', () => {
      expect(controller.__hooks__.get('onDidRender')).toEqual([
        controller.onDidRenderHook.bind(controller),
      ]);
    });
  });
});
