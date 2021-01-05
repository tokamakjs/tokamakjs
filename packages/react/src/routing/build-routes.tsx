import { Class, DiContainer } from '@tokamakjs/injection';
import React from 'react';

import { Reflector } from '../reflection';
import { RouteDefinition } from '../types';
import { createRouteComponent } from './create-route-component';
import { RouteObject } from './router';

async function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: DiContainer,
): Promise<Array<RouteObject>> {
  const finalRoutes: Array<RouteObject> = [];

  for (const routeDefinition of routing) {
    const { path, controller, children } = routeDefinition;
    const { Route, controllerInstance } = await createRouteComponent(context, controller);
    finalRoutes.push({
      path,
      element: <Route />,
      children: await _transformRoutes(children, context),
      controller: controllerInstance,
    });
  }

  return finalRoutes;
}

export async function buildRoutes(
  RootApp: Class,
  container: DiContainer,
): Promise<Array<RouteObject>> {
  const { routing } = Reflector.getSubAppMetadata(RootApp);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return await _transformRoutes(routing, container);
}
