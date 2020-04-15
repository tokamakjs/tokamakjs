import { ObjectRoute } from 'react-router-dom';

import { ModuleMetadata, RouteMetadata } from '../decorators';
import { Constructor } from '../types';
import { RouteDefinition } from './routing';

function _transformRoutes(routing: Array<RouteDefinition>): Array<ObjectRoute> {
  return routing.map(
    ({ path, Route, children }): ObjectRoute => {
      const view = Reflect.getMetadata<RouteMetadata, 'view'>('view', Route);
      const controller = Reflect.getMetadata<RouteMetadata, 'controller'>('controller', Route);
      return {
        path: path,
        element: view(controller),
        children: _transformRoutes(children),
      };
    },
  );
}

export function buildRoutes(Module: Constructor): Array<ObjectRoute> {
  const routing = Reflect.getMetadata<ModuleMetadata, 'routing'>('routing', Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(routing);
}
