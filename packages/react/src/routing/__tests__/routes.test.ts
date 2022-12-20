import { jest } from '@jest/globals';

import { RouteDefinition } from '../../types';

describe('@tokamakjs/react', () => {
  const useNavigateMock = jest.fn();

  beforeAll(async () => {
    jest.unstable_mockModule('react-router', () => {
      return {
        useNavigate: () => useNavigateMock,
        // TODO: Is there a way to exclude unnecessary properties?
        useLocation: jest.fn(),
        useParams: jest.fn(),
        useRoutes: jest.fn(),
      };
    });
  });

  describe('routing', () => {
    describe('createRoute', () => {
      class RootController {}
      class LoginController {}
      class SignUpController {}

      beforeAll(() => {
        Reflect.defineMetadata('self:controller', {}, RootController);
        Reflect.defineMetadata('self:controller', {}, LoginController);
        Reflect.defineMetadata('self:controller', {}, SignUpController);
      });

      it('creates a valid route definition', async () => {
        const { createRoute } = await import('../routes');

        const route = createRoute('/', RootController);

        expect(route).toEqual<RouteDefinition>({
          path: '/',
          Controller: RootController,
          children: [],
        });
      });

      it('creates children routes', async () => {
        const { createRoute } = await import('../routes');

        const route = createRoute('/', RootController, [createRoute('/login', LoginController)]);

        expect(route).toEqual<RouteDefinition>({
          path: '/',
          Controller: RootController,
          children: [{ path: '/login', Controller: LoginController, children: [] }],
        });
      });

      it('flattens an array of arrays as children', async () => {
        const { createRoute } = await import('../routes');

        const result = createRoute('/home', RootController, [
          [createRoute('/login', LoginController)],
          [createRoute('/sign-up', SignUpController)],
        ]);

        expect(result).toEqual({
          path: '/home',
          Controller: RootController,
          children: [
            { path: '/login', Controller: LoginController, children: [] },
            { path: '/sign-up', Controller: SignUpController, children: [] },
          ],
        });
      });
    });

    describe('includeRoutes', () => {
      class LoginController {}
      class SignUpController {}
      class TestModule {}

      const loginRoute = {
        path: '/login',
        Controller: LoginController,
        children: [],
      };

      const signUpRoute = {
        path: '/sign-up',
        Controller: LoginController,
        children: [],
      };

      beforeAll(() => {
        Reflect.defineMetadata('self:controller', {}, LoginController);
        Reflect.defineMetadata('self:controller', {}, SignUpController);
        Reflect.defineMetadata('self:subapp', { routing: [loginRoute, signUpRoute] }, TestModule);
      });

      it('should generate a prefixed array of routes with isIncluded as true', async () => {
        const { includeRoutes } = await import('../routes');

        const result = includeRoutes('/test', TestModule);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ ...loginRoute, path: '/test/login' });
        expect(result[1]).toEqual({ ...signUpRoute, path: '/test/sign-up' });
      });
    });

    describe('createRedirection', () => {
      it('creates a valid route definition', async () => {
        const { createRedirection } = await import('../routes');

        const route = createRedirection('/from', '/to');
        expect(route.path).toBe('/from');
        expect(route.children).toEqual([]);
        expect(route.Controller).toBeDefined();
      });

      it('creates a controller that will redirect when mounted', async () => {
        const { createRedirection } = await import('../routes');

        const { Controller } = createRedirection('/from', '/to');
        new Controller().onDidMount();

        expect(useNavigateMock).toHaveBeenCalledTimes(1);
        expect(useNavigateMock).toHaveBeenCalledWith('/to', { replace: true });
      });
    });
  });
});
