import React, { createElement } from 'react';

import { AppContext } from '../core';
import { RouterState } from '../interfaces';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { createCanActivate } from './can-activate';
import { createRouteComponent } from './create-route-component';
import { HandleError } from './HandleError';
import { RouteObject } from './router';
import { RouteDefinition } from './utils';

function _transformRoutes(
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<RouteObject> {
  return routing.map(
    ({ path, controller, children }): RouteObject => {
      const { view, guards = [], states } = Reflector.getControllerMetadata(controller);

      const instance = context.get(controller);
      const guardInstances = guards.map((guard) => context.get(guard));
      const canActivate = createCanActivate(guardInstances);
      const Route = createRouteComponent(view, instance, states?.loading);
      const ErrorElement = states?.error != null ? createElement(states.error) : undefined;

      return {
        path,
        element: (routerState: RouterState) => {
          return ErrorElement != null ? (
            <HandleError errorView={ErrorElement}>
              <Route canActivate={canActivate} routerState={routerState} />
            </HandleError>
          ) : (
            <Route canActivate={canActivate} routerState={routerState} />
          );
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
