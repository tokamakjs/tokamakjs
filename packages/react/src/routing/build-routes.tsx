import { Class, DiContainer } from '@tokamakjs/injection';
import React from 'react';

import { Reflector } from '../reflection';
import { RouteDefinition } from '../types';
import { RouteObject } from './router';

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: DiContainer,
): Array<RouteObject> {
  const finalRoutes: Array<RouteObject> = [];

  for (const routeDefinition of routing) {
    const { path, Component, children } = routeDefinition;
    finalRoutes.push({
      path,
      element: <Component />,
      children: _transformRoutes(children, context),
    });
  }

  return finalRoutes;
}

export function buildRoutes(RootApp: Class, container: DiContainer): Array<RouteObject> {
  const { routing } = Reflector.getSubAppMetadata(RootApp);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(routing, container);
}
