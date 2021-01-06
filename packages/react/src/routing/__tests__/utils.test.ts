import { RouteDefinition } from '../../types';
import { createRedirection, createRoute, includeRoutes } from '../routes';

describe('utils', () => {
  describe('createRoute', () => {
    class RootController {}
    class LoginController {}
    class SignUpController {}

    beforeAll(() => {
      Reflect.defineMetadata('self:controller', {}, RootController);
      Reflect.defineMetadata('self:controller', {}, LoginController);
      Reflect.defineMetadata('self:controller', {}, SignUpController);
    });

    it('creates a valid route definition', () => {
      const route = createRoute('/', RootController);
      expect(route).toEqual<RouteDefinition>({
        path: '/',
        controller: RootController,
        children: [],
      });
    });

    it('creates children routes', () => {
      const route = createRoute('/', RootController, [createRoute('/login', LoginController)]);
      expect(route).toEqual<RouteDefinition>({
        path: '/',
        controller: RootController,
        children: [{ path: '/login', controller: LoginController, children: [] }],
      });
    });

    it('flattens an array of arrays as children', () => {
      const result = createRoute('/home', RootController, [
        [createRoute('/login', LoginController)],
        [createRoute('/sign-up', SignUpController)],
      ]);

      expect(result).toEqual({
        path: '/home',
        controller: RootController,
        isIncluded: false,
        children: [
          { path: '/login', controller: LoginController, children: [] },
          { path: '/sign-up', controller: SignUpController, children: [] },
        ],
      });
    });

    it('creates an empty controller when a controller-less view is passed instead', () => {
      const route = createRoute('/', () => null);
      expect(route.controller).toBeDefined();
      expect(route.controller.name).toBe('EmptyController');
    });
  });

  describe('includeRoutes', () => {
    class LoginController {}
    class SignUpController {}
    class TestModule {}

    const loginRoute = {
      path: '/login',
      controller: LoginController,
      children: [],
      isIncluded: false,
    };

    const signUpRoute = {
      path: '/sign-up',
      controller: LoginController,
      children: [],
      isIncluded: false,
    };

    beforeAll(() => {
      Reflect.defineMetadata('self:controller', {}, LoginController);
      Reflect.defineMetadata('self:controller', {}, SignUpController);
      Reflect.defineMetadata('self:module', { routing: [loginRoute, signUpRoute] }, TestModule);
    });

    it('should generate a prefixed array of routes with isIncluded as true', () => {
      const result = includeRoutes('/test', TestModule);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ ...loginRoute, path: '/test/login' });
      expect(result[1]).toEqual({ ...signUpRoute, path: '/test/sign-up' });
    });
  });

  describe('createRedirection', () => {
    it('creates a valid route definition', () => {
      const route = createRedirection('/from', '/to');
      expect(route.path).toEqual('/from');
      expect(route.children).toEqual([]);
      expect(route.controller).toBeDefined();
    });

    it('creates a controller that will redirect when mounted', () => {
      const { controller: Controller } = createRedirection('/from', '/to');
      const replaceMock = jest.fn();
      const fakeHistory = { replace: replaceMock };
      const controller = new Controller(fakeHistory) as any;
      controller.onDidMount();
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(fakeHistory.replace).toHaveBeenCalledWith('/to');
    });
  });
});
