import React, { ComponentType } from 'react';
import renderer from 'react-test-renderer';

import { ControllerMetadata } from '../../decorators';
import { AppContext } from '../../injection';
import { Constructor } from '../../utils';
import { ControllerWrapper } from '../controller-wrapper';
import { createRouteComponent } from '../create-route-component';
import * as hooks from '../hooks';

jest.mock('../controller-wrapper');

function _createFakeAppContext(): AppContext {
  const instanceCache = new Map();
  return {
    get: (metatype: Constructor) => {
      if (!instanceCache.has(metatype)) {
        instanceCache.set(metatype, new metatype());
      }

      return instanceCache.get(metatype);
    },
  } as AppContext;
}

function _resetLifeCycleMocks(instance: any): void {
  instance?.onDidMount?.mockReset();
  instance?.onWillUnmount?.mockReset();
  instance?.setRefreshViewFunction?.mockReset();
}

describe('createRouteComponent', () => {
  class RouteController {
    onDidMount = jest.fn();
    onWillUnmount = jest.fn();
  }

  const fakeAppContext = _createFakeAppContext();
  const fakeControllerWrapper = {
    setRefreshViewFunction: jest.fn(),
    onDidMount: jest.fn(),
    onWillUnmount: jest.fn(),
  };
  const fakeController = fakeAppContext.get(RouteController);
  const FakeView = () => <div>TEST_VIEW</div>;
  const FakeViewLoading = () => <div>Loading...</div>;

  let Route: ComponentType;

  beforeAll(() => {
    const fakeControllerMetadata: ControllerMetadata = {
      view: FakeView,
      states: { loading: FakeViewLoading },
    };

    ((ControllerWrapper as unknown) as jest.Mock<ControllerWrapper>).mockImplementation(() => {
      return fakeControllerWrapper as any;
    });

    Reflect.defineMetadata('self:controller', fakeControllerMetadata, RouteController);
    Route = createRouteComponent(fakeAppContext, RouteController);
  });

  it('wraps the route controller in a ControllerWrapper', () => {
    expect(ControllerWrapper).toHaveBeenCalledTimes(1);
  });

  it('sets the name of the React component', () => {
    expect(Route.displayName).toEqual('FakeRoute');
  });

  describe('<Route />', () => {
    beforeEach(() => {
      _resetLifeCycleMocks(fakeControllerWrapper);
      _resetLifeCycleMocks(fakeController);

      // We need to fire useEffect synchronously for tests to pass
      jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect);
    });

    afterEach(() => {
      (React.useEffect as jest.Mock).mockRestore();
    });

    it('renders without throwing', () => {
      expect(() => renderer.create(<Route />)).not.toThrow();
    });

    it('calls the wrapper life-cycle methods', async () => {
      const inst = renderer.create(<Route />);
      expect(fakeControllerWrapper.onDidMount).toHaveBeenCalledTimes(1);
      inst.unmount();
      expect(fakeControllerWrapper.onWillUnmount).toHaveBeenCalledTimes(1);
    });

    it('renders the loading view when pending', () => {
      jest.spyOn(hooks, 'useGuards').mockImplementation(() => {
        return { isPending: true, forbidden: false };
      });

      const inst = renderer.create(<Route />);
      expect(inst.toJSON()).toMatchInlineSnapshot(`
        <div>
          Loading...
        </div>
      `);

      (hooks.useGuards as jest.Mock).mockRestore();
    });

    it('renders null when forbidden', () => {
      jest.spyOn(hooks, 'useGuards').mockImplementation(() => {
        return { isPending: false, forbidden: true };
      });

      const inst = renderer.create(<Route />);
      expect(inst.toJSON()).toBeNull();

      (hooks.useGuards as jest.Mock).mockRestore();
    });

    it('sets the refresh function of the wrapper', () => {
      renderer.create(<Route />);
      expect(fakeControllerWrapper.setRefreshViewFunction).toHaveBeenCalledTimes(1);
    });

    it('calls the controller life-cycle methods', () => {
      const inst = renderer.create(<Route />);
      expect(fakeController.onDidMount).toHaveBeenCalledTimes(1);
      inst.unmount();
      expect(fakeController.onWillUnmount).toHaveBeenCalledTimes(1);
    });

    it('renders the <ViewHolder /> component when is not pending or forbidden', () => {
      const inst = renderer.create(<Route />);
      expect(inst.toJSON()).toMatchInlineSnapshot(`
        <div>
          TEST_VIEW
        </div>
      `);
    });
  });
});
