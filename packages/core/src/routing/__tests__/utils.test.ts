import { RouteDefinition, createRoute, includeRoutes } from '../utils';

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
        isIncluded: false,
      });
    });

    it('creates children routes', () => {
      const route = createRoute('/', RootController, [createRoute('/login', LoginController)]);
      expect(route).toEqual<RouteDefinition>({
        path: '/',
        controller: RootController,
        isIncluded: false,
        children: [
          { path: '/login', controller: LoginController, children: [], isIncluded: false },
        ],
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
          { path: '/login', controller: LoginController, children: [], isIncluded: false },
          { path: '/sign-up', controller: SignUpController, children: [], isIncluded: false },
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
      expect(result[0]).toEqual({ ...loginRoute, path: '/test/login', isIncluded: true });
      expect(result[1]).toEqual({ ...signUpRoute, path: '/test/sign-up', isIncluded: true });
    });
  });
});
