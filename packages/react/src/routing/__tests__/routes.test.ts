import { RouteDefinition } from '../../types';
import { createRedirection, createRoute, includeRoutes } from '../routes';

describe.skip('utils', () => {
  describe('createRoute', () => {
    const RootView = () => null;
    const LoginView = () => null;
    const SignUpView = () => null;

    beforeAll(() => {
      Reflect.defineMetadata('self:controller', {}, RootView);
      Reflect.defineMetadata('self:controller', {}, LoginView);
      Reflect.defineMetadata('self:controller', {}, SignUpView);
    });

    it('creates a valid route definition', () => {
      const route = createRoute('/', RootView);
      expect(route).toEqual<RouteDefinition>({
        path: '/',
        Component: RootView,
        children: [],
      });
    });

    it('creates children routes', () => {
      const route = createRoute('/', RootView, [createRoute('/login', LoginView)]);
      expect(route).toEqual<RouteDefinition>({
        path: '/',
        Component: RootView,
        children: [{ path: '/login', Component: LoginView, children: [] }],
      });
    });

    it('flattens an array of arrays as children', () => {
      const result = createRoute('/home', RootView, [
        [createRoute('/login', LoginView)],
        [createRoute('/sign-up', SignUpView)],
      ]);

      expect(result).toEqual({
        path: '/home',
        controller: RootView,
        children: [
          { path: '/login', controller: LoginView, children: [] },
          { path: '/sign-up', controller: SignUpView, children: [] },
        ],
      });
    });

    it('creates an empty controller when a controller-less view is passed instead', () => {
      const route = createRoute('/', () => null);
      expect(route.Component).toBeDefined();
      // @ts-expect-error
      expect(route.Component.displayName).toBe('EmptyController');
    });
  });

  describe('includeRoutes', () => {
    class LoginView {}
    class SignUpView {}
    class TestModule {}

    const loginRoute = {
      path: '/login',
      controller: LoginView,
      children: [],
    };

    const signUpRoute = {
      path: '/sign-up',
      controller: LoginView,
      children: [],
    };

    beforeAll(() => {
      Reflect.defineMetadata('self:controller', {}, LoginView);
      Reflect.defineMetadata('self:controller', {}, SignUpView);
      Reflect.defineMetadata('self:subapp', { routing: [loginRoute, signUpRoute] }, TestModule);
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
      expect(route.Component).toBeDefined();
    });

    it('creates a controller that will redirect when mounted', () => {
      const { Component } = createRedirection('/from', '/to');
      const replaceMock = jest.fn();
      const fakeHistory = { replace: replaceMock };
      expect(fakeHistory.replace).toHaveBeenCalledTimes(1);
      expect(fakeHistory.replace).toHaveBeenCalledWith('/to');
    });
  });
});
