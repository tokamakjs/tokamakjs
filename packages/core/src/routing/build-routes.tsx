import React from 'react';

import { AppContext } from '../injection';
import { Reflector } from '../reflection';
import { Type } from '../utils';
import { createRouteComponent } from './create-route-component';
import { RouteObject } from './router';
import { RouteDefinition } from './utils';

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<RouteObject> {
  return routing.map(
    ({ path, controller, children }): RouteObject => {
      const Route = createRouteComponent(context, controller);

      return {
        path,
        element: <Route />,
        children: _transformRoutes(children, context),
      };
    },
  );
}

export function buildRoutes(Module: Type, context: AppContext): Array<RouteObject> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(routing, context);
}
