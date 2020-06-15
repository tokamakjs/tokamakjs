import React from 'react';
import renderer from 'react-test-renderer';
import { Subject } from 'rxjs';

import { useMountLifeCycle, useRenderLifeCycle, useTrackLoading } from '../hooks';

describe('hooks', () => {
  const fakeController = {
    onDidMount: jest.fn(),
    onWillUnmount: jest.fn(),
    onDidRender: jest.fn(),
    __isLoading$__: new Subject<boolean>(),
  };

  const TestComponent = () => {
    useMountLifeCycle(fakeController);
    useRenderLifeCycle(fakeController);
    const isLoading = useTrackLoading(fakeController);

    return (
      <div>
        <p id="useTrackLoading">{isLoading}</p>
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
      fakeController.onDidMount.mockReset();
      fakeController.onWillUnmount.mockReset();
    });

    it('calls onDidMount', () => {
      renderer.create(<TestComponent />);
      expect(fakeController.onDidMount).toHaveBeenCalledTimes(1);
    });

    it('calls the returned callback from onDidMount when unmounting', () => {
      const onDidMountCbMock = jest.fn();
      fakeController.onDidMount.mockReturnValue(onDidMountCbMock);

      const inst = renderer.create(<TestComponent />);
      inst.unmount();

      expect(onDidMountCbMock).toHaveBeenCalledTimes(1);
    });

    it('calls onWillUnmount', () => {
      const inst = renderer.create(<TestComponent />);
      inst.unmount();
      expect(fakeController.onWillUnmount).toHaveBeenCalledTimes(1);
    });
  });

  describe('useRenderLifeCycle', () => {
    beforeEach(() => {
      fakeController.onDidRender.mockReset();
    });

    it('calls onDidRender', () => {
      renderer.create(<TestComponent />);
      expect(fakeController.onDidRender).toHaveBeenCalledTimes(1);
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
    it('returns isLoading true while processing the guards', () => {});

    it('returns isLoading false when all guards has been processed', () => {});

    it('returns forbidden true if one guard canActivate method returns false', () => {});

    it('returns forbidden false if every guard canActivate method returns true', () => {});
  });

  describe('useForceUpdate', () => {
    it('returns a function to force update the component', () => {});

    test('when forceUpdate is called, it re-renders the component', () => {});
  });
});
