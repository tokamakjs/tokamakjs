import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Subject } from 'rxjs';

import {
  useForceUpdate,
  useGuards,
  useMountLifeCycle,
  useRenderLifeCycle,
  useTrackLoading,
} from '../hooks';

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
    const isLoading = useTrackLoading(fakeController);
    const { isPending, forbidden } = useGuards(guards);
    return (
      <div>
        <p id="useTrackLoading">{isLoading}</p>
        <p id="useGuards">
          {isPending}
          {forbidden}
        </p>
      </div>
    );
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

  describe('useTrackLoading', () => {
    it('returns the last emitted value of __isLoading$__', () => {
      const inst = renderer.create(<TestComponent />);

      renderer.act(() => fakeController.__isLoading$__.next(false));
      expect(inst.root.findByProps({ id: 'useTrackLoading' }).props.children).toBe(false);

      renderer.act(() => fakeController.__isLoading$__.next(true));
      expect(inst.root.findByProps({ id: 'useTrackLoading' }).props.children).toBe(true);
    });
  });

  describe('useGuards', () => {
    it('returns isLoading true while processing the guards and false when finished', async () => {
      const canActivate = async () => {
        await new Promise((r) => setTimeout(r, 1000));
        return true;
      };

      const guards = [{ canActivate }, { canActivate }];

      const inst = renderer.create(<TestComponent guards={guards} />);
      expect(inst.root.findByProps({ id: 'useGuards' }).props.children[0]).toBe(true);
      await act(async () => await new Promise((r) => setTimeout(r, 2000)));
      expect(inst.root.findByProps({ id: 'useGuards' }).props.children[0]).toBe(false);
    });

    it('returns forbidden true if one guard canActivate method returns false', () => {
      const guards = [{ canActivate: () => true }, { canActivate: () => false }];

      const inst = renderer.create(<TestComponent guards={guards} />);
      expect(inst.root.findByProps({ id: 'useGuards' }).props.children[1]).toBe(true);
    });

    it('returns forbidden false if every guard canActivate method returns true', () => {
      const canActivate = () => true;
      const guards = [{ canActivate }, { canActivate }];

      const inst = renderer.create(<TestComponent guards={guards} />);
      expect(inst.root.findByProps({ id: 'useGuards' }).props.children[1]).toBe(false);
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
