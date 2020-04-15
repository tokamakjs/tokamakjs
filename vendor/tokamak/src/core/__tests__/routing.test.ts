import { createRoute } from '../routing';

describe('createRoute', () => {
  class HomeRoute {}
  class LoginRoute {}

  it('should create a valid route', () => {
    const result = createRoute('/home', HomeRoute);
    expect(result).toMatchObject({
      path: '/home',
      Route: HomeRoute,
      children: [],
    });
  });

  it('should correctly create children routes', () => {
    const result = createRoute('/home', HomeRoute, [createRoute('/login', LoginRoute)]);

    expect(result).toMatchObject({
      path: '/home',
      Route: HomeRoute,
      children: [{ path: '/login', Route: LoginRoute }],
    });
  });
});

describe('includeRoutes', () => {});
