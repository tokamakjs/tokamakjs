import React from 'react';

import { AppContext } from '../injection';
import { Reflector } from '../reflection';
import { Constructor } from '../utils';
import { createRouteComponent } from './create-route-component';
import { RouteObject } from './router';
import { RouteDefinition } from './utils';

async function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: AppContext,
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
  Module: Constructor,
  context: AppContext,
): Promise<Array<RouteObject>> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return await _transformRoutes(routing, context);
}
