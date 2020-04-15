import { ObjectRoute } from 'react-router-dom';

import { Reflector } from '../reflection';
import { RouteDefinition } from './routing';

function _transformRoutes(routing: Array<RouteDefinition>): Array<ObjectRoute> {
  return routing.map(
    ({ path, Route, children }): ObjectRoute => {
      const { view, controller } = Reflector.getRouteMetadata(Route);
      return {
        path: path,
        element: view(controller),
        children: _transformRoutes(children),
      };
    },
  );
}

export function buildRoutes(Module: Function): Array<ObjectRoute> {
  const { routing } = Reflector.getModuleMetadata(Module);

  if (routing == null) {
    throw new Error('Invalid');
  }

  return _transformRoutes(routing);
}
