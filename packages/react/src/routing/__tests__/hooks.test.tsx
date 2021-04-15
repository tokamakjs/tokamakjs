import React from 'react';
import renderer from 'react-test-renderer';
import { Subject } from 'rxjs';

import { useForceUpdate, useMountLifeCycle, useRenderLifeCycle } from '../hooks';

describe('hooks', () => {
  const fakeController = {
    __isLoading$__: new Subject<boolean>(),
    __hooks__: new Map([
      ['onDidMount', [jest.fn()]],
      ['onWillUnmount', [jest.fn()]],
      ['onDidRender', [jest.fn()]],
    ]),
  };

  const TestComponent = ({ guards = [] }: any) => {
    useMountLifeCycle(fakeController);
    useRenderLifeCycle(fakeController);
    return <div></div>;
  };

  beforeAll(() => {
    // We need to fire useEffect synchronously for tests to pass
    jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect);
  });

  afterAll(() => {
    (React.useEffect as jest.Mock).mockRestore();
  });

  describe('useMountLifeCycle', () => {
    beforeEach(() => {
      fakeController.__hooks__.forEach((v) => {
        v.forEach((v) => v.mockReset());
      });
    });

    it('calls onDidMount hooks', () => {
      renderer.create(<TestComponent />);
      expect(fakeController.__hooks__.get('onDidMount')![0]).toHaveBeenCalledTimes(1);
    });

    it('calls the returned callback from onDidMount hooks when unmounting', () => {
      const onDidMountHookCbMock = jest.fn();
      fakeController.__hooks__.get('onDidMount')![0].mockReturnValue(onDidMountHookCbMock);

      const inst = renderer.create(<TestComponent />);
      inst.unmount();

      expect(onDidMountHookCbMock).toHaveBeenCalledTimes(1);
    });

    it('calls onWillUnmount hooks', () => {
      const inst = renderer.create(<TestComponent />);
      inst.unmount();
      expect(fakeController.__hooks__.get('onWillUnmount')![0]).toHaveBeenCalledTimes(1);
    });
  });

  describe('useRenderLifeCycle', () => {
    beforeEach(() => {
      fakeController.__hooks__.get('onDidRender')![0].mockReset();
    });

    it('calls onDidRender hooks', () => {
      renderer.create(<TestComponent />);
      expect(fakeController.__hooks__.get('onDidRender')![0]).toHaveBeenCalledTimes(1);
    });
  });

  describe('useForceUpdate', () => {
    test('when forceUpdate is called, it re-renders the component', () => {
      const trackRendering = jest.fn();

      const TestComponent = () => {
        const forceUpdate = useForceUpdate();
        trackRendering();
        return <button onClick={() => forceUpdate()} />;
      };

      const inst = renderer.create(<TestComponent />);
      expect(trackRendering).toHaveBeenCalledTimes(1);
      renderer.act(() => {
        inst.root.findByType('button').props.onClick();
      });
      expect(trackRendering).toHaveBeenCalledTimes(2);
    });
  });
});
