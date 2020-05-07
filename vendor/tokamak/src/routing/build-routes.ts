import { createElement } from 'react';

import { delay } from '../common';
import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { createRouteComponent } from './create-route-component';
import { RouteObject } from './router';
import { RouteDefinition } from './utils';
import { wrapPromise } from './wrap-promise';

class TestGuard {
  async canActivate(): Promise<boolean> {
    await delay(2000);
    return false;
  }
}

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<RouteObject> {
  return routing.map(
    ({ path, controller, children }): RouteObject => {
      const { view } = Reflector.getControllerMetadata(controller);

      const instance = context.get(controller);
      const guards = view.name === 'HomeView' ? [new TestGuard()] : ([] as any);
      const Route = createRouteComponent(view, instance, guards);

      return {
        path,
        element: (/* state: RouteContext */) => {
          const canActivate =
            guards[0] != null
              ? wrapPromise<boolean>(guards[0].canActivate())
              : { read: () => true };
          return createElement(Route, { canActivate });
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
