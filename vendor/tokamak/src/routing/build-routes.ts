import { ComponentType, createElement } from 'react';
import { ObjectRoute } from 'react-router-dom';

import { AppContext } from '../core';
import { Reflector } from '../reflection';
import { Type } from '../types';
import { createFakeController } from './fake-controller';
import { RouteDefinition } from './utils';

function _transformRoutes(
  Module: Type,
  routing: Array<RouteDefinition>,
  context: AppContext,
): Array<ObjectRoute> {
  return routing.map(
    ({ path, Route, children }): ObjectRoute => {
      const { view, controller } = Reflector.getRouteMetadata(Route);

      let Component: ComponentType;
      if (controller == null) {
        Component = () => view(createFakeController(Route.name));
      } else {
        const instance = context.get(controller);
        Component = () => view(instance);
      }

      Component.displayName = Route.name;

      return {
        path,
        element: createElement(Component),
        children: _transformRoutes(Module, children, context),
      };
    },
  );
}

export function buildRoutes(Module: Type, context: AppContext): Array<ObjectRoute> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(Module, routing, context);
}
