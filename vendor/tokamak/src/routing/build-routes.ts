import { createElement } from 'react';

import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { createCanActivate } from './can-activate';
import { createRouteComponent } from './create-route-component';
import { RouteObject } from './router';
import { RouteDefinition } from './utils';

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<RouteObject> {
  return routing.map(
    ({ path, controller, children }): RouteObject => {
      const { view, guards = [] } = Reflector.getControllerMetadata(controller);

      const instance = context.get(controller);
      const guardInstances = guards.map((guard) => context.get(guard));
      const canActivate = createCanActivate(guardInstances);
      const Route = createRouteComponent(view, instance);

      return {
        path,
        element: (state: any) => {
          return createElement(Route, { canActivate: canActivate(state) });
        },
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
