import { ModuleMetadata } from '../../decorators';
import { RouteDefinition, createRoute, includeRoutes } from '../utils';

describe('createRoute', () => {
  class HomeRoute {}
  class LoginRoute {}
  class SignUpRoute {}

  it('should create a valid route', () => {
    const result = createRoute('/home', HomeRoute);
    expect(result).toEqual({
      path: '/home',
      Route: HomeRoute,
      children: [],
    });
  });

  it('should create children routes', () => {
    const result = createRoute('/home', HomeRoute, [createRoute('/login', LoginRoute)]);

    expect(result).toEqual({
      path: '/home',
      Route: HomeRoute,
      children: [{ path: '/login', Route: LoginRoute, children: [] }],
    });
  });

  it('should flatten an array of arrays as children', () => {
    const result = createRoute('/home', HomeRoute, [
      [createRoute('/login', LoginRoute)],
      [createRoute('/sign-up', SignUpRoute)],
    ]);

    expect(result).toEqual({
      path: '/home',
      Route: HomeRoute,
      children: [
        { path: '/login', Route: LoginRoute, children: [] },
        { path: '/sign-up', Route: SignUpRoute, children: [] },
      ],
    });
  });
});

describe('includeRoutes', () => {
  class AuthModule {}

  const loginRoute: RouteDefinition = {
    path: '/login',
    Route: class LoginRoute {},
    children: [],
  };

  const signUpRoute: RouteDefinition = {
    path: '/sign-up',
    Route: class SignUpRoute {},
    children: [],
  };

  beforeEach(() => {
    Reflect.defineMetadata<ModuleMetadata>('routing', [loginRoute, signUpRoute], AuthModule);
  });

  it('should generate a prefixed array of routes', () => {
    const result = includeRoutes('/auth', AuthModule);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ ...loginRoute, path: '/auth/login' });
    expect(result[1]).toEqual({ ...signUpRoute, path: '/auth/sign-up' });
  });
});
