import { onDidMount, onDidRender, onWillUnmount } from '../controller-life-cycle.decorator';

describe('controller-life-cycle', () => {
  class TestController {
    @onDidMount()
    onDidMountHook() {}

    @onWillUnmount()
    onWillUnmountHook() {}

    @onDidRender()
    onDidRenderHook() {}
  }

  const controller = new TestController() as any;

  describe('@onDidMount', () => {
    it('should add the decorated method to the list of onDidMount hooks', () => {
      expect(controller.__hooks__.get('onDidMount')).toEqual([controller.onDidMountHook]);
    });
  });

  describe('@onWillUnmount', () => {
    it('should add the decorated method to the list of onWillUnmount hooks', () => {
      expect(controller.__hooks__.get('onWillUnmount')).toEqual([controller.onWillUnmountHook]);
    });
  });

  describe('@onDidRender', () => {
    it('should add the decorated method to the list of onDidRender hooks', () => {
      expect(controller.__hooks__.get('onDidRender')).toEqual([controller.onDidRenderHook]);
    });
  });
});
