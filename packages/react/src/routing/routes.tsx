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
  children?: Array<RouteDefinition> | Array<Array<RouteDefinition>>,
): RouteDefinition;
export function createRoute(
  path: string,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>>,
): Array<RouteDefinition>;
export function createRoute(
  path: string,
  Controller: Class<DecoratedController> | Array<RouteDefinition> | Array<Array<RouteDefinition>>,
  children: Array<RouteDefinition> | Array<Array<RouteDefinition>> = [],
): RouteDefinition | Array<RouteDefinition> {
  if (Array.isArray(Controller)) {
    children = Controller;

    // just prefix children with path
    return children.flat().map((c) => ({ ...c, path: urljoin(path, c.path) }));
  }

  return _isArrayOfArrays(children)
    ? { path, Controller, children: children.flat() }
    : { path, Controller, children };
}

export function includeRoutes(basepath: string, SubApp: Class): Array<RouteDefinition> {
  const { routing } = Reflector.getSubAppMetadata(SubApp);
  return routing.map((route) => ({ ...route, path: urljoin(basepath, route.path) }));
}

export function createRedirection(
  from: string,
  to: string,
): RouteDefinition<{ onDidMount: VoidFunction }> {
  class RedirectionController {
    private readonly _navigate = useNavigate();

    @onDidMount()
    public onDidMount(): void {
      this._navigate(to, { replace: true });
    }
  }

  const RedirectionView = () => {
    useController<RedirectionController>();
    return null;
  };

  return {
    path: from,
    // Instead of using the decorator directly, do it this
    // way to get the correct typings and remove the need for casting.
    Controller: Controller({ view: RedirectionView })(RedirectionController),
    children: [],
  };
}
