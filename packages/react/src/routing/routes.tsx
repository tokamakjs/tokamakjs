import { Class } from '@tokamakjs/injection';
import { useNavigate } from 'react-router';
import urljoin from 'url-join';

import { Controller, onDidMount } from '../decorators';
import { useController } from '../hooks';
import { Reflector } from '../reflection';
import { DecoratedController, RouteDefinition } from '../types';

function _isArrayOfArrays<T>(value: Array<any>): value is Array<Array<T>> {
  return value.length > 0 && Array.isArray(value[0]);
}

export function createRoute(
  path: string,
  Controller: Class<DecoratedController>,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition {
  return _isArrayOfArrays(children)
    ? { path, Controller, children: children.flat() }
    : { path, Controller, children };
}

export function includeRoutes(basepath: string, SubApp: Class): Array<RouteDefinition> {
  const { routing } = Reflector.getSubAppMetadata(SubApp);
  return routing.map((route) => ({ ...route, path: urljoin(basepath, route.path) }));
}

export function createRedirection(from: string, to: string): RouteDefinition {
  const RedirectionView = () => {
    useController<RedirectionController>();
    return null;
  };

  @Controller({ view: RedirectionView })
  class RedirectionController {
    private readonly _navigate = useNavigate();

    @onDidMount()
    onDidMount() {
      this._navigate(to, { replace: true });
    }
  }

  return { path: from, Controller: RedirectionController, children: [] };
}
