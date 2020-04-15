import { createElement } from 'react';

import { ModuleMetadata, RouteMetadata } from '../../decorators';
import { buildRoutes } from '../build-routes';
import { RouteDefinition } from '../routing';

describe('buildRoutes', () => {
  const div = createElement('div');
  class AppModule {}

  beforeEach(() => {
    class RootRoute {}
    class LoginRoute {}
    class SignUpRoute {}

    Reflect.defineMetadata<RouteMetadata>('view', () => div, RootRoute);
    Reflect.defineMetadata<RouteMetadata>('view', () => div, LoginRoute);
    Reflect.defineMetadata<RouteMetadata>('view', () => div, SignUpRoute);

    const routing: Array<RouteDefinition> = [
      {
        path: '/',
        Route: RootRoute,
        children: [
          { path: '/login', Route: LoginRoute, children: [] },
          { path: '/sign-up', Route: SignUpRoute, children: [] },
        ],
      },
    ];

    Reflect.defineMetadata<ModuleMetadata>('routing', routing, AppModule);
  });

  it('should return a react-router routes config', () => {
    const result = buildRoutes(AppModule);

    expect(result).toEqual([
      {
        path: '/',
        element: div,
        children: [
          { path: '/login', element: div, children: [] },
          { path: '/sign-up', element: div, children: [] },
        ],
      },
    ]);
  });
});
